import { createRenderEffect, untrack, type Accessor } from "solid-js";

/**
 * Options for configuring parallax layer speeds and motion behavior.
 */
export interface UseParallaxOptions {
  readonly bgSpeed?: number;
  readonly avatarSpeed?: number;
  readonly contentSpeed?: number;
  readonly maxTilt?: number;
  readonly enableTilt?: boolean;
  readonly enableCursorLight?: boolean;
}

/**
 * Parallax offset values and progress accessors produced by the useParallax hook.
 */
export interface ParallaxOffsets {
  readonly bgOffset: Accessor<number>;
  readonly avatarOffset: Accessor<number>;
  readonly contentOffset: Accessor<number>;
  readonly progress: Accessor<number>;
  readonly tiltX: Accessor<number>;
  readonly tiltY: Accessor<number>;
}

/**
 * Hook calculating multi-layer parallax offsets imperatively via CSS custom properties.
 */
export function useParallax(
  targetRef: () => HTMLElement | null,
  options: UseParallaxOptions = {}
): ParallaxOffsets {
  const bgSpeed = options.bgSpeed ?? 100;
  const avatarSpeed = options.avatarSpeed ?? -75;
  const contentSpeed = options.contentSpeed ?? -25;
  const maxTilt = options.maxTilt ?? 4;
  const enableTilt = options.enableTilt ?? false;
  const enableCursorLight = options.enableCursorLight ?? true;

  let currentBg = 0;
  let currentAvatar = 0;
  let currentContent = 0;
  let currentProgress = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let currentShiftX = 0;
  let currentShiftY = 0;
  let currentMouseX = 50;
  let currentMouseY = 50;
  let currentLightOpacity = 0;

  const applyStyles = (
    el: HTMLElement,
    bg: number,
    avatar: number,
    content: number,
    prog: number,
    tiltX: number,
    tiltY: number,
    shiftX = 0,
    shiftY = 0,
    mouseX = 50,
    mouseY = 50,
    lightOpacity = 0
  ) => {
    el.style.setProperty("--parallax-bg", String(bg) + "px");
    el.style.setProperty("--parallax-avatar", String(avatar) + "px");
    el.style.setProperty("--parallax-content", String(content) + "px");
    el.style.setProperty("--parallax-progress", prog.toFixed(4));
    el.style.setProperty("--tilt-x", String(tiltX) + "deg");
    el.style.setProperty("--tilt-y", String(tiltY) + "deg");
    el.style.setProperty("--tilt-shift-x", String(shiftX) + "px");
    el.style.setProperty("--tilt-shift-y", String(shiftY) + "px");
    el.style.setProperty("--mouse-x", String(mouseX) + "%");
    el.style.setProperty("--mouse-y", String(mouseY) + "%");
    el.style.setProperty("--cursor-light-opacity", String(lightOpacity));
  };

  const calculateOffsets = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = (typeof window !== "undefined" && window.innerHeight) || 1;
    const elemHeight = rect.height || 1;
    const elemCenter = rect.top + elemHeight / 2;
    const viewportCenter = windowHeight / 2;
    const halfRange = (windowHeight + elemHeight) / 2;

    const rawProgress = (elemCenter - viewportCenter) / halfRange;
    currentProgress = Math.max(-1.5, Math.min(1.5, rawProgress));

    currentBg = Math.round(currentProgress * bgSpeed * 10) / 10;
    currentAvatar = Math.round(currentProgress * avatarSpeed * 10) / 10;
    currentContent = Math.round(currentProgress * contentSpeed * 10) / 10;

    applyStyles(
      element,
      currentBg,
      currentAvatar,
      currentContent,
      currentProgress,
      currentTiltX,
      currentTiltY,
      currentShiftX,
      currentShiftY,
      currentMouseX,
      currentMouseY,
      currentLightOpacity
    );
  };

  const initialElement = untrack(() => targetRef());
  if (initialElement) {
    calculateOffsets(initialElement);
  }

  createRenderEffect(
    () => targetRef(),
    (element) => {
      if (!element || typeof window === "undefined") {
        return;
      }

      let rafId: number | null = null;
      let isVisible = true;

      const updateOffsets = () => {
        if (!isVisible) {
          return;
        }
        calculateOffsets(element);
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

      const handlePointerMove = (e: MouseEvent | PointerEvent) => {
        if (!enableTilt && !enableCursorLight) {
          return;
        }
        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          return;
        }
        const xRel = (e.clientX - rect.left) / rect.width - 0.5;
        const yRel = (e.clientY - rect.top) / rect.height - 0.5;

        if (enableTilt) {
          currentTiltX = Math.round(-yRel * 2 * maxTilt * 10) / 10;
          currentTiltY = Math.round(xRel * 2 * maxTilt * 10) / 10;
          currentShiftX = Math.round(xRel * 8 * 10) / 10;
          currentShiftY = Math.round(yRel * 8 * 10) / 10;
        } else {
          currentTiltX = 0;
          currentTiltY = 0;
          currentShiftX = 0;
          currentShiftY = 0;
        }

        currentMouseX = enableCursorLight ? Math.round((xRel + 0.5) * 100) : 50;
        currentMouseY = enableCursorLight ? Math.round((yRel + 0.5) * 100) : 50;
        currentLightOpacity = enableCursorLight ? 1 : 0;

        applyStyles(
          element,
          currentBg,
          currentAvatar,
          currentContent,
          currentProgress,
          currentTiltX,
          currentTiltY,
          currentShiftX,
          currentShiftY,
          currentMouseX,
          currentMouseY,
          currentLightOpacity
        );
      };

      const handlePointerLeave = () => {
        currentLightOpacity = 0;
        currentTiltX = 0;
        currentTiltY = 0;
        currentShiftX = 0;
        currentShiftY = 0;
        applyStyles(
          element,
          currentBg,
          currentAvatar,
          currentContent,
          currentProgress,
          0,
          0,
          0,
          0,
          currentMouseX,
          currentMouseY,
          0
        );
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
          { root: null, rootMargin: "100px 0px 100px 0px" }
        );
        observer.observe(element);
      }

      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate, { passive: true });
      element.addEventListener("pointermove", handlePointerMove as EventListener, { passive: true });
      element.addEventListener("pointerleave", handlePointerLeave, { passive: true });

      calculateOffsets(element);

      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        if (observer) {
          observer.disconnect();
        }
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
        element.removeEventListener("pointermove", handlePointerMove as EventListener);
        element.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  );

  return {
    bgOffset: () => currentBg,
    avatarOffset: () => currentAvatar,
    contentOffset: () => currentContent,
    progress: () => currentProgress,
    tiltX: () => currentTiltX,
    tiltY: () => currentTiltY,
  };
}
