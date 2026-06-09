import { Theme } from "./types";

export const lightTheme: Theme = {
  colors: {
    primary: "#0ea5e9",
    secondary: "#0369a1",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
    muted: "#6b7280",
    border: "#e5e7eb",
    success: "#22c55e",
    warning: "#facc15",
    error: "#ef4444",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: {
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
    lineHeight: {
      normal: "1.5",
      relaxed: "1.75",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.15)",
  },
  zIndex: {
    dropdown: 1000,
    modal: 1100,
    tooltip: 1200,
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: "#38bdf8",
    secondary: "#0ea5e9",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    muted: "#94a3b8",
    border: "#334155",
    success: "#4ade80",
    warning: "#fde047",
    error: "#f87171",
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  radii: lightTheme.radii,
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 6px rgba(0,0,0,0.4)",
    lg: "0 10px 15px rgba(0,0,0,0.5)",
  },
  zIndex: lightTheme.zIndex,
  transitions: lightTheme.transitions,
};

export function getTheme(theme: string): Theme {
  return new Proxy({}, {
    get(_, prop: string, __) {
      const target = theme === 'light' ? lightTheme : darkTheme;
      return Reflect.get(target, prop);
    }
  }) as unknown as Theme;
}

export * from "./ThemeController";
export * from "./ThemeToggler";

