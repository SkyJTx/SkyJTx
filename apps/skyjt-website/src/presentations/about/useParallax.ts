import { createSignal, onSettled, type Accessor } from "solid-js";

/**
 * Options for configuring parallax layer speeds and motion behavior.
 */
export interface UseParallaxOptions {
  readonly bgSpeed?: number;
  readonly avatarSpeed?: number;
  readonly contentSpeed?: number;
}

/**
 * Reactive offset values produced by the useParallax hook.
 */
export interface ParallaxOffsets {
  readonly bgOffset: Accessor<number>;
  readonly avatarOffset: Accessor<number>;
  readonly contentOffset: Accessor<number>;
  readonly progress: Accessor<number>;
}

/**
 * Hook calculating multi-layer parallax offsets based on element scroll progress.
 */
export function useParallax(
  targetRef: () => HTMLElement | null,
  options: UseParallaxOptions = {}
): ParallaxOffsets {
  const bgSpeed = options.bgSpeed ?? 45;
  const avatarSpeed = options.avatarSpeed ?? -30;
  const contentSpeed = options.contentSpeed ?? -10;

  const [bgOffset, setBgOffset] = createSignal(0);
  const [avatarOffset, setAvatarOffset] = createSignal(0);
  const [contentOffset, setContentOffset] = createSignal(0);
  const [progress, setProgress] = createSignal(0);

  onSettled(() => {
    if (typeof window === "undefined") {
      return;
    }

    const element = targetRef();
    if (!element) {
      return;
    }

    let rafId: number | null = null;
    let isVisible = true;

    const isReducedMotion = (): boolean => {
      return (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    const updateOffsets = () => {
      if (!isVisible || isReducedMotion()) {
        setBgOffset(0);
        setAvatarOffset(0);
        setContentOffset(0);
        setProgress(0);
        return;
      }

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;
      const elemHeight = rect.height || 1;
      const elemCenter = rect.top + elemHeight / 2;
      const viewportCenter = windowHeight / 2;
      const halfRange = (windowHeight + elemHeight) / 2;

      const rawProgress = (elemCenter - viewportCenter) / halfRange;
      const currentProgress = Math.max(-1.5, Math.min(1.5, rawProgress));

      setProgress(currentProgress);
      setBgOffset(Math.round(currentProgress * bgSpeed * 10) / 10);
      setAvatarOffset(Math.round(currentProgress * avatarSpeed * 10) / 10);
      setContentOffset(Math.round(currentProgress * contentSpeed * 10) / 10);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) {
        return;
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateOffsets();
      });
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              scheduleUpdate();
            }
          }
        },
        { root: null, rootMargin: "50px 0px 50px 0px" }
      );
      observer.observe(element);
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    scheduleUpdate();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  });

  return {
    bgOffset,
    avatarOffset,
    contentOffset,
    progress,
  };
}
