import {
  createEffect,
  onSettled,
  type Accessor,
} from "solid-js";
import type { ResolvedTheme } from "./types";
import { parseBrowserCookies } from "./cookieStorage";
import type { ClientSettingsState } from "./types";

export interface DomThemeSyncOptions {
  readonly resolvedTheme: Accessor<ResolvedTheme>;
  readonly seedColor: Accessor<string>;
  readonly fontSizeValue: Accessor<string>;
  readonly onInitCookies: (cookies: Partial<ClientSettingsState>) => void;
  readonly onSystemDarkChange: (isDark: boolean) => void;
}

export function useDomThemeSync(options: DomThemeSyncOptions): void {
  onSettled(() => {
    if (typeof window === "undefined") return;

    let removeMediaListener: (() => void) | undefined;
    if (typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      options.onSystemDarkChange(mediaQuery.matches);

      const listener = (event: MediaQueryListEvent) => {
        options.onSystemDarkChange(event.matches);
      };
      mediaQuery.addEventListener?.("change", listener);
      removeMediaListener = () => mediaQuery.removeEventListener?.("change", listener);
    }

    const browserCookies = parseBrowserCookies();
    options.onInitCookies(browserCookies);

    return () => {
      removeMediaListener?.();
    };
  });

  createEffect(
    () => options.resolvedTheme(),
    (resolved) => {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", resolved);
      }
    }
  );

  createEffect(
    () => options.seedColor(),
    (seed) => {
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--seed", seed);
      }
    }
  );

  createEffect(
    () => options.fontSizeValue(),
    (sizeVal) => {
      if (typeof document !== "undefined") {
        document.documentElement.style.fontSize = sizeVal;
      }
    }
  );
}
