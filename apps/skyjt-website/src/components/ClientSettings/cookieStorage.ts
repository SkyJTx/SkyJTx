import { parseCookie, stringifySetCookie } from "cookie";
import {
  DEFAULT_SETTINGS,
  type ClientSettingsState,
  type FontSize,
  type ResolvedTheme,
  type ThemeMode,
} from "./types";

const COOKIE_THEME = "skyjt_theme";
const COOKIE_SEED = "skyjt_seed";
const COOKIE_FONT_SIZE = "skyjt_font_size";

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Validates whether a value matches the ThemeMode union.
 */
export function isValidTheme(value: string | undefined): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Validates whether a value matches the FontSize union.
 */
export function isValidFontSize(value: string | undefined): value is FontSize {
  return value === "sm" || value === "md" || value === "lg" || value === "xl";
}

/**
 * Validates whether a value is a valid 6-digit hex color code.
 */
export function isValidHexColor(value: string | undefined): boolean {
  return typeof value === "string" && HEX_COLOR_REGEX.test(value);
}

/**
 * Parses raw cookie string into a key-value record using the RFC 6265 compliant cookie package.
 */
function parseCookieMap(cookieString: string | null | undefined): Record<string, string | undefined> {
  if (!cookieString) return {};
  return parseCookie(cookieString);
}

/**
 * Parses server-side incoming cookie header into client settings with validation and fallbacks.
 */
export function parseServerCookies(cookieHeader: string | null | undefined): ClientSettingsState {
  const cookies = parseCookieMap(cookieHeader);

  const rawTheme = cookies[COOKIE_THEME];
  const theme: ThemeMode = isValidTheme(rawTheme) ? rawTheme : DEFAULT_SETTINGS.theme;

  const rawSeed = cookies[COOKIE_SEED];
  const seedColor = isValidHexColor(rawSeed) ? (rawSeed as string) : DEFAULT_SETTINGS.seedColor;

  const rawFontSize = cookies[COOKIE_FONT_SIZE];
  const fontSize: FontSize = isValidFontSize(rawFontSize) ? rawFontSize : DEFAULT_SETTINGS.fontSize;

  const resolvedTheme: ResolvedTheme = theme === "light" ? "light-seed" : "dark-seed";

  return {
    theme,
    seedColor,
    fontSize,
    resolvedTheme,
  };
}

/**
 * Parses client-side document.cookie into partial settings.
 */
export function parseBrowserCookies(): Partial<ClientSettingsState> {
  if (typeof document === "undefined") {
    return {};
  }
  const cookies = parseCookieMap(document.cookie);
  const result: { theme?: ThemeMode; seedColor?: string; fontSize?: FontSize } = {};

  const rawTheme = cookies[COOKIE_THEME];
  if (isValidTheme(rawTheme)) {
    result.theme = rawTheme;
  }

  const rawSeed = cookies[COOKIE_SEED];
  if (isValidHexColor(rawSeed)) {
    result.seedColor = rawSeed;
  }

  const rawFontSize = cookies[COOKIE_FONT_SIZE];
  if (isValidFontSize(rawFontSize)) {
    result.fontSize = rawFontSize;
  }

  return result;
}

/**
 * Writes a client cookie with a 1-year max age and Lax same-site policy using stringifySetCookie.
 */
export function writeClientCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = stringifySetCookie({
    name,
    value,
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
}

/**
 * Persists updated settings keys into browser cookies.
 */
export function persistSettings(settings: {
  theme?: ThemeMode;
  seedColor?: string;
  fontSize?: FontSize;
}): void {
  if (settings.theme) {
    writeClientCookie(COOKIE_THEME, settings.theme);
  }
  if (settings.seedColor) {
    writeClientCookie(COOKIE_SEED, settings.seedColor);
  }
  if (settings.fontSize) {
    writeClientCookie(COOKIE_FONT_SIZE, settings.fontSize);
  }
}
