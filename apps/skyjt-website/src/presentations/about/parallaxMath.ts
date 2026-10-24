export interface ParallaxOffsetsState {
  readonly bg: number;
  readonly avatar: number;
  readonly content: number;
  readonly progress: number;
  readonly tiltX: number;
  readonly tiltY: number;
  readonly shiftX: number;
  readonly shiftY: number;
  readonly mouseX: number;
  readonly mouseY: number;
  readonly lightOpacity: number;
}

export function computeScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const windowHeight = (typeof window !== "undefined" && window.innerHeight) || 1;
  const elemHeight = rect.height || 1;
  const elemCenter = rect.top + elemHeight / 2;
  const viewportCenter = windowHeight / 2;
  const halfRange = (windowHeight + elemHeight) / 2;

  const rawProgress = (elemCenter - viewportCenter) / halfRange;
  return Math.max(-1.5, Math.min(1.5, rawProgress));
}

export interface TiltComputation {
  readonly tiltX: number;
  readonly tiltY: number;
  readonly shiftX: number;
  readonly shiftY: number;
  readonly mouseX: number;
  readonly mouseY: number;
  readonly lightOpacity: number;
}

export function computeTiltAndLight(
  e: MouseEvent | PointerEvent,
  element: HTMLElement,
  maxTilt: number,
  enableTilt: boolean,
  enableCursorLight: boolean
): TiltComputation {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return {
      tiltX: 0,
      tiltY: 0,
      shiftX: 0,
      shiftY: 0,
      mouseX: 50,
      mouseY: 50,
      lightOpacity: 0,
    };
  }

  const xRel = (e.clientX - rect.left) / rect.width - 0.5;
  const yRel = (e.clientY - rect.top) / rect.height - 0.5;

  let tiltX = 0;
  let tiltY = 0;
  let shiftX = 0;
  let shiftY = 0;

  if (enableTilt) {
    tiltX = Math.round(-yRel * 2 * maxTilt * 10) / 10;
    tiltY = Math.round(xRel * 2 * maxTilt * 10) / 10;
    shiftX = Math.round(xRel * 8 * 10) / 10;
    shiftY = Math.round(yRel * 8 * 10) / 10;
  }

  const mouseX = enableCursorLight ? Math.round((xRel + 0.5) * 100) : 50;
  const mouseY = enableCursorLight ? Math.round((yRel + 0.5) * 100) : 50;
  const lightOpacity = enableCursorLight ? 1 : 0;

  return {
    tiltX,
    tiltY,
    shiftX,
    shiftY,
    mouseX,
    mouseY,
    lightOpacity,
  };
}

export function applyParallaxProperties(el: HTMLElement, state: ParallaxOffsetsState): void {
  el.style.setProperty("--parallax-bg", String(state.bg) + "px");
  el.style.setProperty("--parallax-avatar", String(state.avatar) + "px");
  el.style.setProperty("--parallax-content", String(state.content) + "px");
  el.style.setProperty("--parallax-progress", state.progress.toFixed(4));
  el.style.setProperty("--tilt-x", String(state.tiltX) + "deg");
  el.style.setProperty("--tilt-y", String(state.tiltY) + "deg");
  el.style.setProperty("--tilt-shift-x", String(state.shiftX) + "px");
  el.style.setProperty("--tilt-shift-y", String(state.shiftY) + "px");
  el.style.setProperty("--mouse-x", String(state.mouseX) + "%");
  el.style.setProperty("--mouse-y", String(state.mouseY) + "%");
  el.style.setProperty("--cursor-light-opacity", String(state.lightOpacity));
}
