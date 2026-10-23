import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Score metadata parsed from MuseScore HTML articles.
 */
export interface ScrapedMusicScore {
  readonly id: string;
  readonly title: string;
  readonly scoreUrl: string;
  readonly thumbnailUrl: string;
  readonly partsCount?: string;
  readonly pagesCount?: string;
  readonly duration?: string;
  readonly date?: string;
  readonly views?: string;
  readonly instruments: readonly string[];
}

/**
 * Locates the local Chrome binary across standard Windows and POSIX install directories.
 */
function findChromeExecutable(): string {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error("Google Chrome executable not found on host environment.");
}

/**
 * Executes Chrome headless asynchronously with a virtual time budget and strict process timeout
 * to prevent hanging on lingering WebSockets and long-polling analytics.
 */
async function dumpPageDom(
  chromePath: string,
  targetBaseUrl: string,
  page: number,
  sandboxDir: string
): Promise<string> {
  const url = `${targetBaseUrl}?page=${page}&sort=date_uploaded`;

  try {
    const { stdout } = await execFileAsync(
      chromePath,
      [
        "--headless=new",
        "--incognito",
        `--user-data-dir=${sandboxDir}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-sync",
        "--disable-gpu",
        "--disable-background-networking",
        "--disable-component-update",
        "--disable-features=Translate,OptimizationHints,MediaRouter",
        "--disable-extensions",
        "--disable-blink-features=AutomationControlled",
        "--run-all-compositor-stages-before-draw",
        // Gives JavaScript and initial DOM elements up to 8 seconds to settle, then stops waiting
        "--virtual-time-budget=8000",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "--dump-dom",
        url,
      ],
      {
        maxBuffer: 50 * 1024 * 1024,
        encoding: "utf-8",
        timeout: 20_000, // Hard abort after 20 seconds to guarantee no infinite hang
      }
    );

    // Verify whether Cloudflare or a CAPTCHA gate caught the request
    if (stdout.includes("Just a moment...") || stdout.includes("cf-browser-verification")) {
      throw new Error(
        "Request blocked by Cloudflare / anti-bot verification challenge. CLI headless cannot bypass this barrier directly."
      );
    }

    return stdout;
  } catch (error: any) {
    if (error?.code === "ETIMEDOUT" || error?.signal === "SIGTERM") {
      throw new Error(`Chrome process timed out fetching: ${url}`);
    }
    throw error;
  }
}

/**
 * Extracts author identifier strings dynamically from page 1 HTML.
 */
function extractAuthorIdentifiers(
  targetBaseUrl: string,
  html: string
): readonly string[] {
  const identifiers: string[] = [];

  try {
    const parsedUrl = new URL(targetBaseUrl);
    const slug = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");
    if (slug) {
      identifiers.push(slug);
    }
  } catch {
    const fallbackSlug = targetBaseUrl.split("/").filter(Boolean).pop();
    if (fallbackSlug) {
      identifiers.push(fallbackSlug);
    }
  }

  const canonicalMatch = html.match(
    /<link[^>]+(?:href="https:\/\/musescore\.com\/user\/(\d+)"[^>]+rel="canonical"|rel="canonical"[^>]+href="https:\/\/musescore\.com\/user\/(\d+)")/i
  );
  const canonicalId = canonicalMatch?.[1] ?? canonicalMatch?.[2];
  if (canonicalId) {
    identifiers.push(`/user/${canonicalId}`);
  }

  const ogMatch = html.match(
    /meta[^>]+property="og:url"[^>]+content="https:\/\/musescore\.com\/user\/(\d+)"/i
  );
  const ogId = ogMatch?.[1];
  if (ogId && !identifiers.includes(`/user/${ogId}`)) {
    identifiers.push(`/user/${ogId}`);
  }

  return identifiers;
}

/**
 * Extracts and verifies author scores from rendered HTML string without hardcoded personal IDs.
 */
function parseScoresFromHtml(
  html: string,
  authorIdentifiers: readonly string[]
): readonly ScrapedMusicScore[] {
  const articles = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)];
  const scores: ScrapedMusicScore[] = [];

  for (const match of articles) {
    const content = match[1];
    if (!content) {
      continue;
    }

    const isAuthorScore =
      authorIdentifiers.some((id) => content.includes(id));

    if (!isAuthorScore) {
      continue;
    }

    const linkMatch = content.match(
      /href="(https:\/\/musescore\.com\/user\/\d+\/scores\/(\d+))"/
    );
    if (!linkMatch) {
      continue;
    }

    const scoreUrl = linkMatch[1];
    const id = linkMatch[2];
    if (!scoreUrl || !id) {
      continue;
    }

    const imgMatch = content.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    const rawThumb = imgMatch?.[1];
    const thumbnailUrl = rawThumb ? rawThumb.replace(/&amp;/g, "&") : "";

    const titleMatch = content.match(/class="tUpqA">([\s\S]*?)<\/div>/);
    const rawTitle = titleMatch?.[1];
    const rawAlt = imgMatch?.[2];
    const title = rawTitle
      ? rawTitle.trim()
      : rawAlt
        ? rawAlt.split(" sheet music arranged by")[0]?.trim() ?? "Untitled Score"
        : "Untitled Score";

    const metaMatch = content.match(/class="uRAco">([\s\S]*?)<\/span>/);
    const metaText = metaMatch?.[1] ? metaMatch[1].trim() : "";

    const tags = [...content.matchAll(/class="B7-Vh">([\s\S]*?)<\/div>/gi)]
      .map((m) => m[1]?.trim())
      .filter((tag): tag is string => typeof tag === "string" && tag.length > 0);

    const parts = metaText.split("•").map((s) => s.trim());
    let partsCount: string | undefined;
    let pagesCount: string | undefined;
    let duration: string | undefined;
    let date: string | undefined;
    let views: string | undefined;

    for (const part of parts) {
      if (/^\d+\s+part/i.test(part)) {
        partsCount = part;
      } else if (/^\d+\s+page/i.test(part)) {
        pagesCount = part;
      } else if (/^\d{2}:\d{2}/i.test(part)) {
        duration = part;
      } else if (/view/i.test(part)) {
        views = part;
      } else if (/[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/.test(part)) {
        date = part;
      }
    }

    scores.push({
      id,
      title,
      scoreUrl,
      thumbnailUrl,
      ...(partsCount ? { partsCount } : {}),
      ...(pagesCount ? { pagesCount } : {}),
      ...(duration ? { duration } : {}),
      ...(date ? { date } : {}),
      ...(views ? { views } : {}),
      instruments: tags,
    });
  }

  return scores;
}

/**
 * Main scraper routine traversing all pages sequentially until no new author scores exist.
 */
async function main(): Promise<void> {
  const targetInput = process.env.MUSESCORE_URL ?? process.argv[2];
  if (!targetInput) {
    throw new Error(
      "Target profile URL must be provided via MUSESCORE_URL in .env or as a CLI argument.\n" +
        "Example: bun run scrape:musescore https://musescore.com/<username>\n" +
        "See .env.example for configuration details."
    );
  }

  const targetBaseUrl = targetInput.split("?")[0] ?? targetInput;
  const chromePath = findChromeExecutable();
  const collectedScores: ScrapedMusicScore[] = [];
  const seenIds = new Set<string>();

  const sandboxDir = mkdtempSync(join(tmpdir(), "musescore-sandbox-"));
  try {
    let currentPage = 1;
    const maxPages = 20;
    let authorIdentifiers: readonly string[] = [];

    while (currentPage <= maxPages) {
      process.stdout.write(`Fetching MuseScore page ${currentPage}... `);
      const html = await dumpPageDom(chromePath, targetBaseUrl, currentPage, sandboxDir);

      if (currentPage === 1) {
        authorIdentifiers = extractAuthorIdentifiers(targetBaseUrl, html);
      }

      const pageScores = parseScoresFromHtml(html, authorIdentifiers);

      let newCount = 0;
      for (const score of pageScores) {
        if (!seenIds.has(score.id)) {
          seenIds.add(score.id);
          collectedScores.push(score);
          newCount++;
        }
      }

      console.log(`found ${pageScores.length} author scores (${newCount} new).`);

      if (newCount === 0) {
        break;
      }

      currentPage++;
    }

    const outDir = resolve(
      typeof import.meta.dir === "string" ? import.meta.dir : process.cwd(),
      "../data"
    );
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    const outPath = resolve(outDir, "musicWorksData.json");
    writeFileSync(outPath, JSON.stringify(collectedScores, null, 2), "utf-8");

    console.log(`Successfully extracted ${collectedScores.length} total scores into ${outPath}`);
  } finally {
    rmSync(sandboxDir, { recursive: true, force: true });
  }
}

main().catch((err: unknown) => {
  console.error("Scraping execution failed:", err);
  process.exit(1);
});