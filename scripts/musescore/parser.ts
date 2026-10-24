import * as cheerio from "cheerio";
import type { ScrapedMusicScore } from "./types";

export function extractAuthorIdentifiers(
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

  const $ = cheerio.load(html);
  const canonicalHref = $('link[rel="canonical"]').attr("href");
  const canonicalId = canonicalHref?.match(/musescore\.com\/user\/(\d+)/)?.[1];
  if (canonicalId) {
    identifiers.push(`/user/${canonicalId}`);
  }

  const ogUrl = $('meta[property="og:url"]').attr("content");
  const ogId = ogUrl?.match(/musescore\.com\/user\/(\d+)/)?.[1];
  if (ogId && !identifiers.includes(`/user/${ogId}`)) {
    identifiers.push(`/user/${ogId}`);
  }

  return identifiers;
}

export function parseScoresFromHtml(
  html: string,
  authorIdentifiers: readonly string[]
): readonly ScrapedMusicScore[] {
  const $ = cheerio.load(html);
  const scores: ScrapedMusicScore[] = [];

  $("article").each((_, element) => {
    const article = $(element);
    const content = article.html() || "";
    if (!content) {
      return;
    }

    const isAuthorScore = authorIdentifiers.some((id) => content.includes(id));
    if (!isAuthorScore) {
      return;
    }

    const linkEl = article.find('a[href*="/scores/"]').first();
    const scoreUrl = linkEl.attr("href");
    if (!scoreUrl) {
      return;
    }

    const idMatch = scoreUrl.match(/\/scores\/(\d+)/);
    const id = idMatch?.[1];
    if (!id) {
      return;
    }

    const img = article.find("img").first();
    const rawThumb = img.attr("src");
    const thumbnailUrl = rawThumb ? rawThumb.replace(/&amp;/g, "&") : "";

    const rawTitle = article.find(".tUpqA").first().text().trim();
    const rawAlt = img.attr("alt") || "";
    const title = rawTitle
      ? rawTitle
      : rawAlt
        ? rawAlt.split(" sheet music arranged by")[0]?.trim() ?? "Untitled Score"
        : "Untitled Score";

    const metaText = article.find(".uRAco").first().text().trim();
    const tags: string[] = [];
    article.find(".B7-Vh").each((_, tagEl) => {
      const tag = $(tagEl).text().trim();
      if (tag) {
        tags.push(tag);
      }
    });

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
      } else if (/ago|\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(part)) {
        date = part;
      }
    }

    scores.push({
      id,
      title,
      scoreUrl,
      thumbnailUrl,
      partsCount,
      pagesCount,
      duration,
      date,
      views,
      instruments: tags,
    });
  });

  return scores;
}
