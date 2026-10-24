import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  type Accessor,
  type ParentProps,
} from "solid-js";
import type { JSX } from "@solidjs/web";
import {
  DEFAULT_SETTINGS,
  FONT_SIZE_MAP,
  type ClientSettingsState,
  type FontSize,
  type ResolvedTheme,
  type ThemeMode,
} from "./types";
import { persistSettings } from "./cookieStorage";
import { useDomThemeSync } from "./useDomThemeSync";

export interface ClientSettingsContextValue {
  readonly theme: Accessor<ThemeMode>;
  readonly resolvedTheme: Accessor<ResolvedTheme>;
  readonly seedColor: Accessor<string>;
  readonly fontSize: Accessor<FontSize>;
  readonly fontSizeValue: Accessor<string>;
  readonly setTheme: (mode: ThemeMode) => void;
  readonly setSeedColor: (color: string) => void;
  readonly setFontSize: (size: FontSize) => void;
  readonly resetDefaults: () => void;
}

const ClientSettingsContext = createContext<ClientSettingsContextValue | null>(null, {
  name: "ClientSettingsContext",
});

export interface ClientSettingsProviderProps extends ParentProps {
  readonly initialSettings?: Partial<ClientSettingsState>;
}

export function ClientSettingsProvider(props: ClientSettingsProviderProps): JSX.Element {
  const [theme, setThemeSignal] = createSignal<ThemeMode>(
    props.initialSettings?.theme ?? DEFAULT_SETTINGS.theme
  );
  const [seedColor, setSeedColorSignal] = createSignal<string>(
    props.initialSettings?.seedColor ?? DEFAULT_SETTINGS.seedColor
  );
  const [fontSize, setFontSizeSignal] = createSignal<FontSize>(
    props.initialSettings?.fontSize ?? DEFAULT_SETTINGS.fontSize
  );
  const [systemPrefersDark, setSystemPrefersDark] = createSignal<boolean>(true);

  const resolvedTheme = createMemo<ResolvedTheme>(() => {
    const currentTheme = theme();
    if (currentTheme === "system") {
      return systemPrefersDark() ? "dark-seed" : "light-seed";
    }
    return currentTheme === "dark" ? "dark-seed" : "light-seed";
  });

  const fontSizeValue = createMemo(() => FONT_SIZE_MAP[fontSize()]);

  useDomThemeSync({
    resolvedTheme,
    seedColor,
    fontSizeValue,
    onSystemDarkChange: (isDark) => setSystemPrefersDark(isDark),
    onInitCookies: (cookies) => {
      if (cookies.theme) setThemeSignal(cookies.theme);
      if (cookies.seedColor) setSeedColorSignal(cookies.seedColor);
      if (cookies.fontSize) setFontSizeSignal(cookies.fontSize);
    },
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeSignal(mode);
    persistSettings({ theme: mode });
  };

  const setSeedColor = (color: string) => {
    setSeedColorSignal(color);
    persistSettings({ seedColor: color });
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeSignal(size);
    persistSettings({ fontSize: size });
  };

  const resetDefaults = () => {
    setTheme(DEFAULT_SETTINGS.theme);
    setSeedColor(DEFAULT_SETTINGS.seedColor);
    setFontSize(DEFAULT_SETTINGS.fontSize);
  };

  return (
    <ClientSettingsContext
      value={{
        theme,
        resolvedTheme,
        seedColor,
        fontSize,
        fontSizeValue,
        setTheme,
        setSeedColor,
        setFontSize,
        resetDefaults,
      }}
    >
      {props.children}
    </ClientSettingsContext>
  );
}

export function useClientSettings(): ClientSettingsContextValue {
  const context = useContext(ClientSettingsContext);
  if (!context) {
    throw new Error("useClientSettings must be used within a ClientSettingsProvider");
  }
  return context;
}
