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
  private transitioningSignal = useSignal(false);
  private fromThemeSignal = useSignal<"light" | "dark">("dark");
  private toThemeSignal = useSignal<"light" | "dark">("dark");
  private progressSignal = useSignal<number>(1);
  private isInitialized = false;

  private resolvedThemeSignal = useComputed(() => {
    const mode = this.modeSignal.value;
    if (mode === "system") {
      return this.systemThemeSignal.value;
    }
    return mode;
  });

  /**
   * Initializes the theme controller state and registers listeners.
   */
  public init() {
    if (this.isInitialized || typeof window === "undefined") {
      return;
    }
    this.isInitialized = true;

    const savedValue = localStorage.getItem("theme-mode");
    const saved = (savedValue === "light" || savedValue === "dark" || savedValue === "system") ? savedValue : null;
    if (saved) {
      this.modeSignal.value = saved;
    }

    const query = window.matchMedia("(prefers-color-scheme: light)");
    this.systemThemeSignal.value = query.matches ? "light" : "dark";

    const currentTheme = this.resolvedTheme.value;
    this.fromThemeSignal.value = currentTheme;
    this.toThemeSignal.value = currentTheme;
    this.progressSignal.value = 1;

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
    return this.resolvedThemeSignal;
  }

  /**
   * Returns whether the theme is currently in a transition state.
   */
  public get isTransitioning(): boolean {
    return this.transitioningSignal.value;
  }

  /**
   * Returns the source theme during a transition.
   */
  public get fromTheme(): "light" | "dark" {
    return this.fromThemeSignal.value;
  }

  /**
   * Returns the target theme during a transition.
   */
  public get toTheme(): "light" | "dark" {
    return this.toThemeSignal.value;
  }

  /**
   * Returns the transition progress value between 0 and 1.
   */
  public get progress(): number {
    return this.progressSignal.value;
  }

  /**
   * Cycles or toggles the theme mode.
   */
  public async toggle() {
    if (this.transitioningSignal.value) {
      return;
    }

    const currentTheme = this.resolvedTheme.value;

    const mode = this.modeSignal.value;
    let nextMode: ThemeMode;
    if (mode === "light") {
      nextMode = "dark";
    } else if (mode === "dark") {
      nextMode = "system";
    } else {
      nextMode = "light";
    }

    let nextTheme: "light" | "dark";
    if (nextMode === "system") {
      nextTheme = this.systemThemeSignal.value;
    } else {
      nextTheme = nextMode;
    }

    if (currentTheme === nextTheme) {
      this.mode = nextMode;
      return;
    }

    this.fromThemeSignal.value = currentTheme;
    this.toThemeSignal.value = nextTheme;
    this.progressSignal.value = 0;
    this.transitioningSignal.value = true;

    this.mode = nextMode;

    const duration = 300;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      this.progressSignal.value = p;

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        this.transitioningSignal.value = false;
      }
    };

    requestAnimationFrame(animate);
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
