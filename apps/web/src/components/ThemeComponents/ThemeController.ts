import { useSignal, useComputed, useEffect } from "@skyjt/signals-solid";
import { createContext, useContext } from "solid-js";

/**
 * Supported theme modes.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Controller class to manage the application's theme state.
 * Synchronizes with localStorage and document element attributes.
 */
export class ThemeController {
  private modeSignal = useSignal<ThemeMode>("system");
  private systemThemeSignal = useSignal<"light" | "dark">("dark");
  private isInitialized = false;

  /**
   * Initializes the theme controller state and registers listeners.
   */
  public init() {
    if (this.isInitialized || typeof window === "undefined") {
      return;
    }
    this.isInitialized = true;

    const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      this.modeSignal.value = saved;
    }

    const query = window.matchMedia("(prefers-color-scheme: light)");
    this.systemThemeSignal.value = query.matches ? "light" : "dark";

    const listener = (event: MediaQueryListEvent) => {
      this.systemThemeSignal.value = event.matches ? "light" : "dark";
    };

    query.addEventListener("change", listener);

    useEffect(() => {
      const mode = this.modeSignal.value;
      localStorage.setItem("theme-mode", mode);
      const activeTheme = this.resolvedTheme.value;
      document.documentElement.setAttribute("data-theme", activeTheme);
      document.documentElement.setAttribute("theme", activeTheme);
    });
  }

  /**
   * Returns the current theme mode.
   */
  public get mode(): ThemeMode {
    return this.modeSignal.value;
  }

  /**
   * Sets the current theme mode.
   */
  public set mode(value: ThemeMode) {
    this.modeSignal.value = value;
  }

  /**
   * Returns a computed signal of the active theme ("light" or "dark").
   */
  public get resolvedTheme() {
    return useComputed(() => {
      const mode = this.modeSignal.value;
      if (mode === "system") {
        return this.systemThemeSignal.value;
      }
      return mode;
    });
  }

  /**
   * Cycles or toggles the theme mode.
   */
  public toggle() {
    const mode = this.modeSignal.value;
    if (mode === "light") {
      this.mode = "dark";
    } else if (mode === "dark") {
      this.mode = "system";
    } else {
      this.mode = "light";
    }
  }
}

/**
 * Context to provide and consume the ThemeController instance.
 */
export const ThemeContext = createContext<ThemeController>();

/**
 * Hook to consume the ThemeController context.
 * @returns The ThemeController instance.
 * @throws Error if used outside of AppThemeProvider.
 */
export function useThemeController(): ThemeController {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeController must be used within an AppThemeProvider");
  }
  return context;
}
