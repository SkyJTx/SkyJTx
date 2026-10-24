import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
import { isExecTimeoutError } from "./types";

const execFileAsync = promisify(execFile);

export function findChromeExecutable(): string {
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

export async function dumpPageDom(
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
        "--virtual-time-budget=8000",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "--dump-dom",
        url,
      ],
      {
        maxBuffer: 50 * 1024 * 1024,
        encoding: "utf-8",
        timeout: 20_000,
      }
    );

    if (stdout.includes("Just a moment...") || stdout.includes("cf-browser-verification")) {
      throw new Error(
        "Request blocked by Cloudflare / anti-bot verification challenge. CLI headless cannot bypass this barrier directly."
      );
    }

    return stdout;
  } catch (error: unknown) {
    if (isExecTimeoutError(error)) {
      throw new Error(`Chrome process timed out fetching: ${url}`);
    }
    throw error;
  }
}
