import type { JSX } from "@solidjs/web";
import {
  For,
  Show,
  createSignal,
  createEffect,
  onSettled,
} from "solid-js";

/**
 * Properties for NavigationMenu component.
 */
export interface NavigationMenuProps {
  readonly sections: readonly string[];
  readonly activeSection: string;
  readonly onSelectSection: (section: string) => void;
}

/**
 * Navigation menu rendering exclusively the section links with a continuous sliding active highlight pill.
 */
export function NavigationMenu(props: NavigationMenuProps): JSX.Element {
  let navRef: HTMLElement | undefined;
  const buttonRefs = new Map<string, HTMLButtonElement>();
  let rafId: number | undefined;
  let isMounted = false;
  let currentSection = "";

  const [indicatorStyle, setIndicatorStyle] = createSignal<{
    readonly left: number;
    readonly width: number;
    readonly ready: boolean;
  }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const measureAndApply = (section: string) => {
    if (typeof window === "undefined" || !navRef || !isMounted) return;
    if (document.readyState !== "complete") {
      return;
    }
    const btn = buttonRefs.get(section);
    if (btn) {
      const idx = props.sections.indexOf(section);
      const fallbackWidth = 60;
      const left = btn.offsetLeft || (idx >= 0 ? idx * fallbackWidth : 0);
      const width = btn.offsetWidth || fallbackWidth;
      setIndicatorStyle({
        left,
        width,
        ready: true,
      });
    }
  };

  const scheduleIndicator = (section: string) => {
    if (typeof window === "undefined") return;
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      measureAndApply(section);
    });
  };

  createEffect(
    () => props.activeSection,
    (section) => {
      currentSection = section;
      if (isMounted) {
        scheduleIndicator(section);
      }
    }
  );

  onSettled(() => {
    isMounted = true;
    if (typeof window === "undefined") return;

    const onPageReady = () => {
      if (!isMounted) return;
      scheduleIndicator(currentSection);
    };

    if (document.readyState === "complete") {
      scheduleIndicator(currentSection);
    } else {
      window.addEventListener("load", onPageReady, { once: true });
    }

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          scheduleIndicator(currentSection);
        }
      });
    }

    const handleResize = () => {
      if (document.readyState === "complete") {
        scheduleIndicator(currentSection);
      }
    };
    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && navRef) {
      ro = new ResizeObserver(() => {
        if (document.readyState === "complete") {
          scheduleIndicator(currentSection);
        }
      });
      ro.observe(navRef);
    }

    return () => {
      isMounted = false;
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("load", onPageReady);
      window.removeEventListener("resize", handleResize);
      ro?.disconnect();
    };
  });

  return (
    <nav
      ref={(el) => {
        navRef = el;
      }}
      class="relative flex items-center gap-0.5 sm:gap-1 shrink-0"
      aria-label="Main Navigation"
    >
      {/* Continuous Sliding Background Pill */}
      <Show when={indicatorStyle().ready}>
        <div
          class="absolute inset-y-0 left-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-0"
          style={{
            transform: `translateX(${indicatorStyle().left}px)`,
            width: `${indicatorStyle().width}px`,
          }}
          aria-hidden="true"
        >
          <div class="w-full h-full rounded-lg sm:rounded-xl bg-base-content/10 dark:bg-base-content/15 shadow-xs" />
        </div>
      </Show>

      <For each={props.sections}>
        {(section) => {
          const isActive = () => props.activeSection === section;
          return (
            <button
              ref={(el) => {
                if (el) {
                  buttonRefs.set(section, el);
                }
              }}
              type="button"
              aria-current={isActive() ? "page" : undefined}
              class={[
                "relative z-10 px-2 py-1 min-[380px]:px-2.5 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer rounded-lg sm:rounded-xl select-none shrink-0 whitespace-nowrap",
                isActive()
                  ? "text-primary font-bold"
                  : "text-base-content/75 hover:text-base-content hover:bg-base-content/5",
              ]}
              onClick={() => {
                props.onSelectSection(section);
              }}
            >
              <span>{section}</span>
            </button>
          );
        }}
      </For>
    </nav>
  );
}