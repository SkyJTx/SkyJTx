export interface ExecTimeoutError {
  readonly code?: string;
  readonly signal?: string;
}

export function isExecTimeoutError(error: unknown): error is ExecTimeoutError {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  return e.code === "ETIMEDOUT" || e.signal === "SIGTERM";
}

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
