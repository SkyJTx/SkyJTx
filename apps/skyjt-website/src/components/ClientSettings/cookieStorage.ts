import { parseCookie, stringifySetCookie } from "cookie";
import * as v from "valibot";
import {
  DEFAULT_SETTINGS,
  ThemeModeSchema,
  FontSizeSchema,
  SeedColorSchema,
  type ClientSettingsState,
  type FontSize,
  type ResolvedTheme,
  type ThemeMode,
} from "./types";

const COOKIE_THEME = "skyjt_theme";
const COOKIE_SEED = "skyjt_seed";
const COOKIE_FONT_SIZE = "skyjt_font_size";

/**
 * Validates whether a value matches the ThemeMode union.
 */
export function isValidTheme(value: unknown): value is ThemeMode {
  return v.is(ThemeModeSchema, value);
}

/**
 * Validates whether a value matches the FontSize union.
 */
export function isValidFontSize(value: unknown): value is FontSize {
  return v.is(FontSizeSchema, value);
}

/**
 * Validates whether a value is a valid 6-digit hex color code.
 */
export function isValidHexColor(value: unknown): value is string {
  return v.is(SeedColorSchema, value);
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
  const themeParsed = v.safeParse(ThemeModeSchema, rawTheme);
  const theme: ThemeMode = themeParsed.success ? themeParsed.output : DEFAULT_SETTINGS.theme;

  const rawSeed = cookies[COOKIE_SEED];
  const seedParsed = v.safeParse(SeedColorSchema, rawSeed);
  const seedColor = seedParsed.success ? seedParsed.output : DEFAULT_SETTINGS.seedColor;

  const rawFontSize = cookies[COOKIE_FONT_SIZE];
  const fontParsed = v.safeParse(FontSizeSchema, rawFontSize);
  const fontSize: FontSize = fontParsed.success ? fontParsed.output : DEFAULT_SETTINGS.fontSize;

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

  const themeParsed = v.safeParse(ThemeModeSchema, cookies[COOKIE_THEME]);
  const seedParsed = v.safeParse(SeedColorSchema, cookies[COOKIE_SEED]);
  const fontParsed = v.safeParse(FontSizeSchema, cookies[COOKIE_FONT_SIZE]);

  return {
    ...(themeParsed.success ? { theme: themeParsed.output } : {}),
    ...(seedParsed.success ? { seedColor: seedParsed.output } : {}),
    ...(fontParsed.success ? { fontSize: fontParsed.output } : {}),
  };
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
