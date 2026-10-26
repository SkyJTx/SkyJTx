import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { findChromeExecutable, dumpPageDom } from "./musescore/browser";
import { extractAuthorIdentifiers, parseScoresFromHtml } from "./musescore/parser";
import type { ScrapedMusicScore } from "./musescore/types";

const TARGET_BASE_URL = process.env.MUSESCORE_URL ?? process.argv[2] ?? "https://musescore.com/user/29513374";
const OUTPUT_FILE = resolve(import.meta.dirname, "../apps/skyjt-website/public/.secrets/musicWorksData.json");
const MAX_PAGES = 5;

async function run(): Promise<void> {
  const chromePath = findChromeExecutable();
  console.log(`Found Chrome binary at: ${chromePath}`);

  const sandboxDir = mkdtempSync(join(tmpdir(), "chrome-scrape-"));
  console.log(`Created isolated user-data sandbox at: ${sandboxDir}`);

  try {
    const scoresMap = new Map<string, ScrapedMusicScore>();
    let authorIdentifiers: readonly string[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      console.log(`\n[Page ${page}/${MAX_PAGES}] Requesting DOM via Chrome Headless...`);
      const html = await dumpPageDom(chromePath, TARGET_BASE_URL, page, sandboxDir);

      if (page === 1) {
        authorIdentifiers = extractAuthorIdentifiers(TARGET_BASE_URL, html);
        console.log(`Extracted author identifier filter: ${JSON.stringify(authorIdentifiers)}`);
      }

      const pageScores = parseScoresFromHtml(html, authorIdentifiers);
      console.log(`[Page ${page}] Extracted ${pageScores.length} matching score cards.`);

      if (pageScores.length === 0) {
        console.log(`Terminating crawl early at page ${page} (no author scores matched).`);
        break;
      }

      let newItemsCount = 0;
      for (const score of pageScores) {
        if (!scoresMap.has(score.id)) {
          scoresMap.set(score.id, score);
          newItemsCount++;
        }
      }

      console.log(`[Page ${page}] Added ${newItemsCount} new unique scores to collection.`);

      if (page < MAX_PAGES) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    const finalScores = Array.from(scoresMap.values());
    console.log(`\nTotal aggregated unique author scores: ${finalScores.length}`);

    mkdirSync(resolve(OUTPUT_FILE, ".."), { recursive: true });
    writeFileSync(OUTPUT_FILE, JSON.stringify(finalScores, null, 2) + "\n", "utf-8");
    console.log(`Successfully written sheet music data to: ${OUTPUT_FILE}`);
  } finally {
    try {
      rmSync(sandboxDir, { recursive: true, force: true });
      console.log(`Cleaned up temporary sandbox directory: ${sandboxDir}`);
    } catch (cleanupError) {
      console.warn(`Failed to remove temp directory (${sandboxDir}):`, cleanupError);
    }
  }
}

void run();
