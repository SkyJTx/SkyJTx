/**
 * Supported color theme modes.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Resolved DaisyUI theme names.
 */
export type ResolvedTheme = "light-seed" | "dark-seed";

/**
 * Supported root font size scale.
 */
export type FontSize = "sm" | "md" | "lg" | "xl";

/**
 * Client settings state representation.
 */
export interface ClientSettingsState {
  readonly theme: ThemeMode;
  readonly seedColor: string;
  readonly fontSize: FontSize;
  readonly resolvedTheme: ResolvedTheme;
}

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
