import { DefaultTheme } from "solid-styled-components";

/**
 * Generates a CSS color-mix rule to apply opacity to a CSS variable or hex color.
 *
 * @param color - The color string (e.g. Hex or CSS variable).
 * @param opacity - The opacity value as a decimal between 0 and 1.
 * @returns The CSS color-mix color declaration.
 */
export function withOpacity(color: string, opacity: number): string {
  const percentage = Math.round(opacity * 100);
  return `color-mix(in srgb, ${color} ${percentage}%, transparent)`;
}

/**
 * Type-safe helper to retrieve the theme from styled component properties.
 *
 * @param props - Styled component properties.
 * @returns The resolved Theme object.
 * @throws Error if theme is not defined in props.
 */
export function styledTheme(props: { theme?: DefaultTheme }): DefaultTheme {
  const t = props.theme;
  if (!t) {
    throw new Error("Theme is not defined. Ensure Component is within AppThemeProvider.");
  }
  return t;
}
