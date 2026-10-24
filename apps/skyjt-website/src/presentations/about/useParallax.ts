import { createRenderEffect, untrack, type Accessor } from "solid-js";
import {
  computeScrollProgress,
  computeTiltAndLight,
  applyParallaxProperties,
  type ParallaxOffsetsState,
} from "./parallaxMath";

export interface UseParallaxOptions {
  readonly bgSpeed?: number;
  readonly avatarSpeed?: number;
  readonly contentSpeed?: number;
  readonly maxTilt?: number;
  readonly enableTilt?: boolean;
  readonly enableCursorLight?: boolean;
}

export interface ParallaxOffsets {
  readonly bgOffset: Accessor<number>;
  readonly avatarOffset: Accessor<number>;
  readonly contentOffset: Accessor<number>;
  readonly progress: Accessor<number>;
  readonly tiltX: Accessor<number>;
  readonly tiltY: Accessor<number>;
}

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

  const updateProperties = (element: HTMLElement) => {
    const state: ParallaxOffsetsState = {
      bg: currentBg,
      avatar: currentAvatar,
      content: currentContent,
      progress: currentProgress,
      tiltX: currentTiltX,
      tiltY: currentTiltY,
      shiftX: currentShiftX,
      shiftY: currentShiftY,
      mouseX: currentMouseX,
      mouseY: currentMouseY,
      lightOpacity: currentLightOpacity,
    };
    applyParallaxProperties(element, state);
  };

  const calculateOffsets = (element: HTMLElement) => {
    currentProgress = computeScrollProgress(element);
    currentBg = Math.round(currentProgress * bgSpeed * 10) / 10;
    currentAvatar = Math.round(currentProgress * avatarSpeed * 10) / 10;
    currentContent = Math.round(currentProgress * contentSpeed * 10) / 10;
    updateProperties(element);
  };

  createRenderEffect(
    () => targetRef(),
    (element) => {
      if (!element || typeof window === "undefined") return;

      let rafId: number | null = null;
      let isVisible = true;

      const scheduleUpdate = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (isVisible) {
            calculateOffsets(element);
          }
        });
      };

      const handlePointerMove = (e: MouseEvent | PointerEvent) => {
        if (!enableTilt && !enableCursorLight) return;

        const tilt = computeTiltAndLight(e, element, maxTilt, enableTilt, enableCursorLight);
        currentTiltX = tilt.tiltX;
        currentTiltY = tilt.tiltY;
        currentShiftX = tilt.shiftX;
        currentShiftY = tilt.shiftY;
        currentMouseX = tilt.mouseX;
        currentMouseY = tilt.mouseY;
        currentLightOpacity = tilt.lightOpacity;

        updateProperties(element);
      };

      const handlePointerLeave = () => {
        currentLightOpacity = 0;
        currentTiltX = 0;
        currentTiltY = 0;
        currentShiftX = 0;
        currentShiftY = 0;
        updateProperties(element);
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

      untrack(() => {
        calculateOffsets(element);
      });

      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        observer?.disconnect();
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
