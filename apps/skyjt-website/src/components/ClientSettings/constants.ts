import type { FontSize, ThemeMode } from "./types";
import type { SegmentOption } from "~/components/SegmentButton";
import { SunIcon, MoonIcon, MonitorIcon } from "./ClientSettingsIcons";

export const THEME_OPTIONS: readonly SegmentOption<ThemeMode>[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

export const FONT_SIZE_OPTIONS: readonly SegmentOption<FontSize>[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Default" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra" },
];
