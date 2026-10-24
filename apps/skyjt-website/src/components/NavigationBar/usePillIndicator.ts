import {
  createSignal,
  createEffect,
  onSettled,
  type Accessor,
} from "solid-js";

export interface PillIndicatorStyle {
  readonly left: number;
  readonly width: number;
  readonly ready: boolean;
}

export interface UsePillIndicatorOptions {
  readonly sections: Accessor<readonly string[]>;
  readonly activeSection: Accessor<string>;
  readonly navRef: Accessor<HTMLElement | undefined>;
}

export function usePillIndicator(options: UsePillIndicatorOptions) {
  const buttonRefs = new Map<string, HTMLButtonElement>();
  let rafId: number | undefined;
  let isMounted = false;
  let currentSection = "";

  const [indicatorStyle, setIndicatorStyle] = createSignal<PillIndicatorStyle>({
    left: 0,
    width: 0,
    ready: false,
  });

  const registerButton = (section: string, el: HTMLButtonElement | null) => {
    if (el) {
      buttonRefs.set(section, el);
    } else {
      buttonRefs.delete(section);
    }
  };

  const measureAndApply = (section: string) => {
    const nav = options.navRef();
    if (typeof window === "undefined" || !nav || !isMounted) return;
    if (document.readyState !== "complete") return;

    const btn = buttonRefs.get(section);
    if (btn) {
      const idx = options.sections().indexOf(section);
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
    () => options.activeSection(),
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

    const onResize = () => {
      if (!isMounted) return;
      scheduleIndicator(currentSection);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let resizeObserver: ResizeObserver | undefined;
    const nav = options.navRef();
    if (typeof ResizeObserver !== "undefined" && nav) {
      resizeObserver = new ResizeObserver(() => {
        if (!isMounted) return;
        scheduleIndicator(currentSection);
      });
      resizeObserver.observe(nav);
      for (const btn of buttonRefs.values()) {
        resizeObserver.observe(btn);
      }
    }

    return () => {
      isMounted = false;
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("load", onPageReady);
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
    };
  });

  return {
    indicatorStyle,
    registerButton,
    scheduleIndicator,
  };
}
