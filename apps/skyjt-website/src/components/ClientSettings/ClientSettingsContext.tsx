import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  createEffect,
  onSettled,
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
import {
  parseBrowserCookies,
  persistSettings,
} from "./cookieStorage";

/**
 * Context payload for client settings state and actions.
 */
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

/**
 * Properties for ClientSettingsProvider.
 */
export interface ClientSettingsProviderProps extends ParentProps {
  readonly initialSettings?: Partial<ClientSettingsState>;
}

/**
 * Context provider managing theme mode, seed color, and font size backed by cookie persistence.
 */
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

  onSettled(() => {
    if (typeof window === "undefined") return;

    let removeMediaListener: (() => void) | undefined;
    if (typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemPrefersDark(mediaQuery.matches);

      const listener = (event: MediaQueryListEvent) => {
        setSystemPrefersDark(event.matches);
      };
      mediaQuery.addEventListener?.("change", listener);
      removeMediaListener = () => mediaQuery.removeEventListener?.("change", listener);
    }

    const browserCookies = parseBrowserCookies();
    if (browserCookies.theme) {
      setThemeSignal(browserCookies.theme);
    }
    if (browserCookies.seedColor) {
      setSeedColorSignal(browserCookies.seedColor);
    }
    if (browserCookies.fontSize) {
      setFontSizeSignal(browserCookies.fontSize);
    }

    return () => {
      removeMediaListener?.();
    };
  });

  createEffect(
    () => resolvedTheme(),
    (resolved) => {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", resolved);
      }
    }
  );

  createEffect(
    () => seedColor(),
    (seed) => {
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--seed", seed);
      }
    }
  );

  createEffect(
    () => fontSizeValue(),
    (sizeVal) => {
      if (typeof document !== "undefined") {
        document.documentElement.style.fontSize = sizeVal;
      }
    }
  );

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

/**
 * Hook to consume client settings state and actions.
 */
export function useClientSettings(): ClientSettingsContextValue {
  const context = useContext(ClientSettingsContext);
  if (!context) {
    throw new Error("useClientSettings must be used within a ClientSettingsProvider");
  }
  return context;
}
