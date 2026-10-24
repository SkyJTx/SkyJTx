import * as v from "valibot";

/**
 * Permitted color theme modes.
 */
export const THEME_MODES = ["light", "dark", "system"] as const;
export const ThemeModeSchema = v.picklist(THEME_MODES);
export type ThemeMode = v.InferOutput<typeof ThemeModeSchema>;

/**
 * Resolved DaisyUI theme names.
 */
export const RESOLVED_THEMES = ["light-seed", "dark-seed"] as const;
export const ResolvedThemeSchema = v.picklist(RESOLVED_THEMES);
export type ResolvedTheme = v.InferOutput<typeof ResolvedThemeSchema>;

/**
 * Permitted root font size scale.
 */
export const FONT_SIZES = ["sm", "md", "lg", "xl"] as const;
export const FontSizeSchema = v.picklist(FONT_SIZES);
export type FontSize = v.InferOutput<typeof FontSizeSchema>;

/**
 * Valid 6-digit hex color format (#RRGGBB).
 */
export const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
export const SeedColorSchema = v.pipe(
  v.string(),
  v.regex(HEX_COLOR_REGEX, "Must be a valid 6-digit hex color code")
);
export type SeedColor = v.InferOutput<typeof SeedColorSchema>;

/**
 * Client settings state representation.
 */
export const ClientSettingsStateSchema = v.object({
  theme: ThemeModeSchema,
  seedColor: SeedColorSchema,
  fontSize: FontSizeSchema,
  resolvedTheme: ResolvedThemeSchema,
});
export type ClientSettingsState = Readonly<v.InferOutput<typeof ClientSettingsStateSchema>>;

/**
 * Preset theme color specification.
 */
export interface PresetColor {
  readonly name: string;
  readonly value: string;
}

/**
 * Preset seed colors available in the palette.
 */
export const PRESET_COLORS: readonly PresetColor[] = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Fuchsia", value: "#d946ef" },
] as const;

/**
 * Default fallback settings.
 */
export const DEFAULT_SETTINGS: ClientSettingsState = {
  theme: "system",
  seedColor: "#4f46e5",
  fontSize: "md",
  resolvedTheme: "dark-seed",
};

/**
 * CSS font size pixel values for font size scale.
 */
export const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
};
