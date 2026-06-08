import { JSX, onMount } from "solid-js";
import { ThemeProvider as SolidThemeProvider } from "solid-styled-components";
import { lightTheme, darkTheme } from "./index";
import { useComputed, useSignal } from "@skyjt/signals-solid";

interface AppThemeProviderProps {
  initialMode?: "light" | "dark";
  children: JSX.Element;
}

export function AppThemeProvider(props: AppThemeProviderProps) {
  const themeMode = useSignal<"light" | "dark" | null>(
    props.initialMode || null,
  );
  const isMounted = useSignal(false);

  onMount(() => {
    isMounted.value = true;
  });

  const isDarkMode = useComputed(() => {
    if (themeMode.value === "light") return false;
    if (themeMode.value === "dark") return true;
    if (!isMounted.value) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const theme = useComputed(() => (isDarkMode.value ? darkTheme : lightTheme));

  return (
    <SolidThemeProvider theme={theme.value}>
      {props.children}
    </SolidThemeProvider>
  );
}
