/// <reference types="@solidjs/start/env" />

import "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

declare module "solid-styled-components" {
  export interface DefaultTheme extends Theme {}
}

declare global {
  interface Window {
    isScrollingToSection?: boolean;
    isObserverUpdating?: boolean;
    scrollTimeoutId?: number;
  }
}
