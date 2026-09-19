import {
  createContext,
  useContext,
  createSignal,
  type Accessor,
  type Setter,
  type ParentProps,
} from "solid-js";
import type { JSX } from "@solidjs/web";

/**
 * Context payload for navigation state management and smooth scrolling.
 */
export interface NavigationContextValue {
  activeSection: Accessor<string>;
  setActiveSection: Setter<string>;
  scrollToSection: (section: string) => void;
  isProgrammaticScroll: Accessor<boolean>;
}

const NavigationContext = createContext<NavigationContextValue | null>(null, {
  name: "NavigationContext",
});

/**
 * Provides active section tracking and smooth scrolling methods across views.
 */
export function NavigationProvider(props: ParentProps): JSX.Element {
  const [activeSection, setActiveSection] = createSignal("Home");
  const [isProgrammaticScroll, setIsProgrammaticScroll] = createSignal(false);
  let scrollLockTimeout: ReturnType<typeof setTimeout> | null = null;

  const scrollToSection = (section: string) => {
    setIsProgrammaticScroll(true);
    setActiveSection(section);

    if (scrollLockTimeout) {
      clearTimeout(scrollLockTimeout);
    }

    if (typeof window !== "undefined") {
      const unlock = () => {
        setIsProgrammaticScroll(false);
        window.removeEventListener("scrollend", unlock);
      };

      if ("onscrollend" in window) {
        window.addEventListener("scrollend", unlock, { once: true });
      }
      scrollLockTimeout = setTimeout(unlock, 800);

      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <NavigationContext
      value={{
        activeSection,
        setActiveSection,
        scrollToSection,
        isProgrammaticScroll,
      }}
    >
      {props.children}
    </NavigationContext>
  );
}

/**
 * Hook to consume the current navigation context.
 */
export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return ctx;
}
