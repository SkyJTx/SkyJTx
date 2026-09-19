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
}

const NavigationContext = createContext<NavigationContextValue | null>(null, {
  name: "NavigationContext",
});

/**
 * Provides active section tracking and smooth scrolling methods across views.
 */
export function NavigationProvider(props: ParentProps): JSX.Element {
  const [activeSection, setActiveSection] = createSignal("Home");

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    if (typeof document !== "undefined") {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <NavigationContext value={{ activeSection, setActiveSection, scrollToSection }}>
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
