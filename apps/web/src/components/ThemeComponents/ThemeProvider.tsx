import { JSX, onMount } from "solid-js";
import { ThemeProvider as SolidThemeProvider, styled } from "solid-styled-components";
import { lightTheme, darkTheme } from "./index";
import { useComputed, useSignal } from "@skyjt/signals-solid";
import { Theme } from "./types";

import { ThemeController, ThemeContext } from "./ThemeController";

interface AppThemeProviderProps {
  initialMode?: "light" | "dark";
  children: JSX.Element;
}

const Overlay = styled("div")<{ theme: Theme; visible: boolean }>`
  position: fixed;
  inset: 0;
  background: ${(props) => props.theme.colors.background};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
  transition: opacity ${(props) => props.theme.transitions.normal};
  z-index: 9999;
`;

export function AppThemeProvider(props: AppThemeProviderProps) {
  const isMounted = useSignal(false);
  const controller = new ThemeController();

  const theme = useComputed(() => {
    if (!isMounted.value) return darkTheme;
    return controller.resolvedTheme.value === "light" ? lightTheme : darkTheme;
  });

  onMount(() => {
    if (props.initialMode) {
      controller.mode = props.initialMode;
    }
    controller.init();
    isMounted.value = true;
  });

  return (
    <ThemeContext.Provider value={controller}>
      <SolidThemeProvider theme={theme.value}>
        {props.children}
        <Overlay visible={!isMounted.value} theme={theme.value} />
      </SolidThemeProvider>
    </ThemeContext.Provider>
  );
}


