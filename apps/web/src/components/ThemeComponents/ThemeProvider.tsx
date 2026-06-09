import { JSX, onMount } from "solid-js";
import { ThemeProvider as SolidThemeProvider, styled } from "solid-styled-components";
import { lightTheme, darkTheme } from "./index";
import { useSignal, useEffect } from "@skyjt/signals-solid";
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
  transition: opacity 0.5s ease-in-out, background-color 0.5s ease-in-out;
  z-index: 9999;
`;

function interpolateColor(color1: string, color2: string, progress: number): string {
  const hex = (c: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
    return r ? {
      r: parseInt(r[1], 16),
      g: parseInt(r[2], 16),
      b: parseInt(r[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const c1 = hex(color1);
  const c2 = hex(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);

  const toHex = (n: number) => {
    const s = n.toString(16);
    return s.length === 1 ? "0" + s : s;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function AppThemeProvider(props: AppThemeProviderProps) {
  const isMounted = useSignal(false);
  const controller = new ThemeController();

  const themeProxy = new Proxy({} as Theme, {
    get(target, prop) {
      if (!isMounted.value) return Reflect.get(darkTheme, prop);

      if (prop === "colors") {
        const activeTheme = controller.resolvedTheme.value === "light" ? lightTheme : darkTheme;
        const colorsObj = {} as any;
        for (const key of Object.keys(activeTheme.colors)) {
          colorsObj[key] = `var(--color-${key})`;
        }
        return colorsObj;
      }

      const activeTheme = controller.resolvedTheme.value === "light" ? lightTheme : darkTheme;
      return Reflect.get(activeTheme, prop);
    }
  });

  useEffect(() => {
    if (!isMounted.value) return;

    const fromT = controller.fromTheme === "light" ? lightTheme : darkTheme;
    const toT = controller.toTheme === "light" ? lightTheme : darkTheme;
    const p = controller.progress;
    const isTransitioning = controller.isTransitioning;

    const activeTheme = controller.resolvedTheme.value === "light" ? lightTheme : darkTheme;
    const colors = isTransitioning ? toT.colors : activeTheme.colors;

    for (const [key, val] of Object.entries(colors)) {
      let colorVal = val;
      if (isTransitioning) {
        const c1 = Reflect.get(fromT.colors, key);
        const c2 = Reflect.get(toT.colors, key);
        if (typeof c1 === "string" && typeof c2 === "string" && c1.startsWith("#") && c2.startsWith("#")) {
          colorVal = interpolateColor(c1, c2, p);
        }
      }
      document.documentElement.style.setProperty(`--color-${key}`, colorVal);
    }
  });

  onMount(() => {
    if (props.initialMode) {
      controller.mode = props.initialMode;
    }
    controller.init();
    
    // Set initial CSS variables
    const activeTheme = controller.resolvedTheme.value === "light" ? lightTheme : darkTheme;
    for (const [key, val] of Object.entries(activeTheme.colors)) {
      document.documentElement.style.setProperty(`--color-${key}`, val);
    }

    isMounted.value = true;
  });

  return (
    <ThemeContext.Provider value={controller}>
      <SolidThemeProvider theme={themeProxy}>
        {props.children}
        <Overlay visible={!isMounted.value} theme={themeProxy} />
      </SolidThemeProvider>
    </ThemeContext.Provider>
  );
}
