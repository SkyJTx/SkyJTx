import { onMount, onCleanup, JSX } from "solid-js";
import {
  HitTestBehavior,
  GestureDetectorProps,
  Offset,
  Velocity,
  TapDownDetails,
  TapUpDetails,
  LongPressStartDetails,
  LongPressMoveUpdateDetails,
  LongPressEndDetails,
  DragDownDetails,
  DragStartDetails,
  DragUpdateDetails,
  DragEndDetails,
  ScaleStartDetails,
  ScaleUpdateDetails,
  ScaleEndDetails,
} from "./types";

interface PointerHistoryEntry {
  x: number;
  y: number;
  time: number;
}

/**
 * Detector for various gesture interactions matching Flutter GestureDetector API.
 */
export function GestureDetector(props: GestureDetectorProps) {
  let containerRef: HTMLDivElement | undefined;

  const activePointers = new Map<number, PointerHistoryEntry>();
  const pointerHistories = new Map<number, PointerHistoryEntry[]>();
  const pointerHits = new Map<number, boolean>();

  let doubleTapTimeout: number | undefined;
  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;

  let longPressTimeout: number | undefined;
  let isLongPressActive = false;

  let activeGesture: "dragHorizontal" | "dragVertical" | "pan" | "scale" | null = null;
  let startX = 0;
  let startY = 0;
  let wasDragging = false;

  let initialScaleDistance = 0;
  let initialScaleAngle = 0;

  const isElementSolid = (el: HTMLElement): boolean => {
    if (
      el.tagName === "IMG" ||
      el.tagName === "SVG" ||
      el.tagName === "BUTTON" ||
      el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.tagName === "A"
    ) {
      return true;
    }
    for (let i = 0; i < el.childNodes.length; i++) {
      const node = el.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        return true;
      }
    }
    const style = window.getComputedStyle(el);
    if (
      style.backgroundColor &&
      style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      style.backgroundColor !== "transparent"
    ) {
      return true;
    }
    if (style.backgroundImage && style.backgroundImage !== "none") {
      return true;
    }
    if (
      style.borderStyle &&
      style.borderStyle !== "none" &&
      style.borderWidth &&
      parseFloat(style.borderWidth) > 0
    ) {
      const borderColor = style.borderColor;
      if (borderColor && borderColor !== "rgba(0, 0, 0, 0)" && borderColor !== "transparent") {
        return true;
      }
    }
    return false;
  };

  const checkHit = (e: PointerEvent): boolean => {
    const behavior = props.behavior || HitTestBehavior.deferToChild;
    if (behavior === HitTestBehavior.opaque) {
      return true;
    }
    const target = e.target as HTMLElement;
    if (!target || !containerRef || !containerRef.contains(target)) {
      return false;
    }
    if (behavior === HitTestBehavior.deferToChild) {
      let curr: HTMLElement | null = target;
      while (curr && curr !== containerRef) {
        if (isElementSolid(curr)) {
          return true;
        }
        curr = curr.parentElement;
      }
      return isElementSolid(containerRef);
    }
    return true;
  };

  const propagateToBackground = (e: PointerEvent) => {
    if ((e as any).__propagated || !containerRef) {
      return;
    }
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const bgElement = elements.find(
      (el) => el !== containerRef && !containerRef.contains(el),
    );
    if (bgElement) {
      const cloned = new PointerEvent(e.type, {
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        button: e.button,
        buttons: e.buttons,
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        isPrimary: e.isPrimary,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      (cloned as any).__propagated = true;
      bgElement.dispatchEvent(cloned);
    }
  };

  const getOffsets = (clientX: number, clientY: number): { global: Offset; local: Offset } => {
    const global: Offset = {
      dx: clientX,
      dy: clientY,
      x: clientX,
      y: clientY,
    };
    let local: Offset = { ...global };
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      local = {
        dx: clientX - rect.left,
        dy: clientY - rect.top,
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }
    return { global, local };
  };

  const getVelocity = (pointerId: number): Velocity => {
    const history = pointerHistories.get(pointerId) || [];
    const now = Date.now();
    const recent = history.filter((h) => now - h.time <= 100);
    let px = 0;
    let py = 0;
    if (recent.length >= 2) {
      const first = recent[0];
      const last = recent[recent.length - 1];
      const dt = (last.time - first.time) / 1000;
      if (dt > 0) {
        px = (last.x - first.x) / dt;
        py = (last.y - first.y) / dt;
      }
    }
    return {
      pixelsPerSecond: {
        dx: px,
        dy: py,
        x: px,
        y: py,
      },
    };
  };

  const handlePointerDown = (e: PointerEvent) => {
    const isHit = checkHit(e);
    pointerHits.set(e.pointerId, isHit);

    const behavior = props.behavior || HitTestBehavior.deferToChild;
    if (behavior === HitTestBehavior.translucent || !isHit) {
      propagateToBackground(e);
    }

    if (!isHit) {
      return;
    }

    const pos = { x: e.clientX, y: e.clientY, time: Date.now() };
    activePointers.set(e.pointerId, pos);
    pointerHistories.set(e.pointerId, [pos]);

    if (activePointers.size === 1) {
      startX = e.clientX;
      startY = e.clientY;
      wasDragging = false;
      activeGesture = null;

      const { global, local } = getOffsets(e.clientX, e.clientY);

      if (e.button === 0) {
        if (props.onTapDown) {
          props.onTapDown({ globalPosition: global, localPosition: local });
        }
        if (props.onLongPressDown) {
          props.onLongPressDown({ globalPosition: global, localPosition: local });
        }

        const now = Date.now();
        const dist = Math.sqrt(
          (e.clientX - lastTapX) * (e.clientX - lastTapX) +
            (e.clientY - lastTapY) * (e.clientY - lastTapY),
        );
        if (now - lastTapTime < 300 && dist < 20) {
          if (props.onDoubleTapDown) {
            props.onDoubleTapDown({ globalPosition: global, localPosition: local });
          }
          if (doubleTapTimeout) {
            window.clearTimeout(doubleTapTimeout);
            doubleTapTimeout = undefined;
          }
        }

        longPressTimeout = window.setTimeout(() => {
          isLongPressActive = true;
          if (props.onLongPress) {
            props.onLongPress();
          }
          if (props.onLongPressStart) {
            props.onLongPressStart({ globalPosition: global, localPosition: local });
          }
        }, 500);

        if (props.onVerticalDragDown) {
          props.onVerticalDragDown({ globalPosition: global, localPosition: local });
        }
        if (props.onHorizontalDragDown) {
          props.onHorizontalDragDown({ globalPosition: global, localPosition: local });
        }
        if (props.onPanDown) {
          props.onPanDown({ globalPosition: global, localPosition: local });
        }
      } else if (e.button === 2) {
        if (props.onSecondaryTapDown) {
          props.onSecondaryTapDown({ globalPosition: global, localPosition: local });
        }
      } else if (e.button === 1) {
        if (props.onTertiaryTapDown) {
          props.onTertiaryTapDown({ globalPosition: global, localPosition: local });
        }
      }

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerCancel);
    } else if (activePointers.size === 2 && (props.onScaleStart || props.onScaleUpdate)) {
      const pts = Array.from(activePointers.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      initialScaleDistance = Math.sqrt(dx * dx + dy * dy);
      initialScaleAngle = Math.atan2(dy, dx);

      if (longPressTimeout) {
        window.clearTimeout(longPressTimeout);
        longPressTimeout = undefined;
      }

      const focalX = (pts[0].x + pts[1].x) / 2;
      const focalY = (pts[0].y + pts[1].y) / 2;
      const { global, local } = getOffsets(focalX, focalY);

      activeGesture = "scale";
      if (props.onScaleStart) {
        props.onScaleStart({ focalPoint: global, localFocalPoint: local });
      }
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    const isHit = pointerHits.get(e.pointerId);
    const behavior = props.behavior || HitTestBehavior.deferToChild;
    if (behavior === HitTestBehavior.translucent || !isHit) {
      propagateToBackground(e);
    }

    if (!isHit) {
      return;
    }

    const currentX = e.clientX;
    const currentY = e.clientY;
    const pos = { x: currentX, y: currentY, time: Date.now() };
    activePointers.set(e.pointerId, pos);

    const history = pointerHistories.get(e.pointerId) || [];
    history.push(pos);
    pointerHistories.set(e.pointerId, history);

    const { global, local } = getOffsets(currentX, currentY);

    if (activeGesture === "scale" && activePointers.size >= 2) {
      const pts = Array.from(activePointers.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const currentAngle = Math.atan2(dy, dx);

      const scale = initialScaleDistance > 0 ? currentDistance / initialScaleDistance : 1.0;
      const rotation = currentAngle - initialScaleAngle;

      const focalX = (pts[0].x + pts[1].x) / 2;
      const focalY = (pts[0].y + pts[1].y) / 2;
      const focalOffsets = getOffsets(focalX, focalY);

      if (props.onScaleUpdate) {
        props.onScaleUpdate({
          focalPoint: focalOffsets.global,
          localFocalPoint: focalOffsets.local,
          scale,
          rotation,
          horizontalScale: scale,
          verticalScale: scale,
        });
      }
      return;
    }

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!activeGesture && distance > 10) {
      if (longPressTimeout) {
        window.clearTimeout(longPressTimeout);
        longPressTimeout = undefined;
      }
      if (doubleTapTimeout) {
        window.clearTimeout(doubleTapTimeout);
        doubleTapTimeout = undefined;
      }

      if (props.onPanStart) {
        activeGesture = "pan";
        if (props.onPanStart) {
          props.onPanStart({ globalPosition: global, localPosition: local });
        }
      } else if (props.onHorizontalDragStart && Math.abs(deltaX) > Math.abs(deltaY)) {
        activeGesture = "dragHorizontal";
        if (props.onHorizontalDragStart) {
          props.onHorizontalDragStart({ globalPosition: global, localPosition: local });
        }
      } else if (props.onVerticalDragStart && Math.abs(deltaY) > Math.abs(deltaX)) {
        activeGesture = "dragVertical";
        if (props.onVerticalDragStart) {
          props.onVerticalDragStart({ globalPosition: global, localPosition: local });
        }
      }

      if (activeGesture) {
        wasDragging = true;
        if (props.onTapCancel) {
          props.onTapCancel();
        }
        if (props.onSecondaryTapCancel) {
          props.onSecondaryTapCancel();
        }
        if (props.onDoubleTapCancel) {
          props.onDoubleTapCancel();
        }
        if (isLongPressActive && props.onLongPressCancel) {
          props.onLongPressCancel();
        }
      }
    }

    if (activeGesture) {
      const prevPos = history[history.length - 2] || pos;
      const delta: Offset = {
        dx: currentX - prevPos.x,
        dy: currentY - prevPos.y,
        x: currentX - prevPos.x,
        y: currentY - prevPos.y,
      };

      if (activeGesture === "pan" && props.onPanUpdate) {
        props.onPanUpdate({ globalPosition: global, localPosition: local, delta });
      } else if (activeGesture === "dragHorizontal" && props.onHorizontalDragUpdate) {
        props.onHorizontalDragUpdate({
          globalPosition: global,
          localPosition: local,
          delta,
          primaryDelta: delta.dx,
        });
      } else if (activeGesture === "dragVertical" && props.onVerticalDragUpdate) {
        props.onVerticalDragUpdate({
          globalPosition: global,
          localPosition: local,
          delta,
          primaryDelta: delta.dy,
        });
      }
    } else if (isLongPressActive && props.onLongPressMoveUpdate) {
      props.onLongPressMoveUpdate({ globalPosition: global, localPosition: local });
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    const isHit = pointerHits.get(e.pointerId);
    const behavior = props.behavior || HitTestBehavior.deferToChild;
    if (behavior === HitTestBehavior.translucent || !isHit) {
      propagateToBackground(e);
    }

    if (!isHit) {
      pointerHits.delete(e.pointerId);
      return;
    }

    const { global, local } = getOffsets(e.clientX, e.clientY);
    const velocity = getVelocity(e.pointerId);

    if (activeGesture === "scale") {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        activeGesture = null;
        if (props.onScaleEnd) {
          props.onScaleEnd({ velocity });
        }
      }
    } else if (activeGesture) {
      if (activeGesture === "pan" && props.onPanEnd) {
        props.onPanEnd({ velocity });
      } else if (activeGesture === "dragHorizontal" && props.onHorizontalDragEnd) {
        props.onHorizontalDragEnd({
          velocity,
          primaryVelocity: velocity.pixelsPerSecond.dx,
        });
      } else if (activeGesture === "dragVertical" && props.onVerticalDragEnd) {
        props.onVerticalDragEnd({
          velocity,
          primaryVelocity: velocity.pixelsPerSecond.dy,
        });
      }
      activeGesture = null;
      activePointers.delete(e.pointerId);
    } else {
      activePointers.delete(e.pointerId);

      if (longPressTimeout) {
        window.clearTimeout(longPressTimeout);
        longPressTimeout = undefined;
      }

      if (isLongPressActive) {
        if (props.onLongPressEnd) {
          props.onLongPressEnd({ globalPosition: global, localPosition: local, velocity });
        }
        if (props.onLongPressUp) {
          props.onLongPressUp();
        }
        isLongPressActive = false;
      } else if (e.button === 0) {
        const now = Date.now();
        const dist = Math.sqrt(
          (e.clientX - lastTapX) * (e.clientX - lastTapX) +
            (e.clientY - lastTapY) * (e.clientY - lastTapY),
        );

        if (now - lastTapTime < 300 && dist < 20) {
          if (props.onDoubleTap) {
            props.onDoubleTap();
          }
          lastTapTime = 0;
        } else {
          lastTapTime = now;
          lastTapX = e.clientX;
          lastTapY = e.clientY;

          if (props.onDoubleTap) {
            doubleTapTimeout = window.setTimeout(() => {
              if (props.onTapUp) {
                props.onTapUp({ globalPosition: global, localPosition: local });
              }
              if (props.onTap) {
                props.onTap();
              }
              doubleTapTimeout = undefined;
            }, 300);
          } else {
            if (props.onTapUp) {
              props.onTapUp({ globalPosition: global, localPosition: local });
            }
            if (props.onTap) {
              props.onTap();
            }
          }
        }
      } else if (e.button === 2) {
        if (props.onSecondaryTapUp) {
          props.onSecondaryTapUp({ globalPosition: global, localPosition: local });
        }
        if (props.onSecondaryTap) {
          props.onSecondaryTap();
        }
      } else if (e.button === 1) {
        if (props.onTertiaryTapUp) {
          props.onTertiaryTapUp({ globalPosition: global, localPosition: local });
        }
      }
    }

    pointerHistories.delete(e.pointerId);
    pointerHits.delete(e.pointerId);

    if (activePointers.size === 0) {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    }
  };

  const handlePointerCancel = (e: PointerEvent) => {
    const isHit = pointerHits.get(e.pointerId);
    if (!isHit) {
      pointerHits.delete(e.pointerId);
      return;
    }

    if (longPressTimeout) {
      window.clearTimeout(longPressTimeout);
      longPressTimeout = undefined;
    }
    if (doubleTapTimeout) {
      window.clearTimeout(doubleTapTimeout);
      doubleTapTimeout = undefined;
    }

    if (activeGesture === "scale") {
      activeGesture = null;
      if (props.onScaleEnd) {
        props.onScaleEnd({
          velocity: { pixelsPerSecond: { dx: 0, dy: 0, x: 0, y: 0 } },
        });
      }
    } else if (activeGesture) {
      if (activeGesture === "pan" && props.onPanCancel) {
        props.onPanCancel();
      } else if (activeGesture === "dragHorizontal" && props.onHorizontalDragCancel) {
        props.onHorizontalDragCancel();
      } else if (activeGesture === "dragVertical" && props.onVerticalDragCancel) {
        props.onVerticalDragCancel();
      }
      activeGesture = null;
    } else {
      if (props.onTapCancel) {
        props.onTapCancel();
      }
      if (props.onSecondaryTapCancel) {
        props.onSecondaryTapCancel();
      }
      if (props.onDoubleTapCancel) {
        props.onDoubleTapCancel();
      }
      if (isLongPressActive && props.onLongPressCancel) {
        props.onLongPressCancel();
      }
    }

    isLongPressActive = false;
    activePointers.delete(e.pointerId);
    pointerHistories.delete(e.pointerId);
    pointerHits.delete(e.pointerId);

    if (activePointers.size === 0) {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    }
  };

  const handleClickCapture = (e: MouseEvent) => {
    if (wasDragging) {
      e.preventDefault();
      e.stopPropagation();
      wasDragging = false;
    }
  };

  onMount(() => {
    if (containerRef) {
      containerRef.addEventListener("click", handleClickCapture, { capture: true });
    }

    onCleanup(() => {
      if (typeof window === "undefined") return;
      if (doubleTapTimeout) {
        window.clearTimeout(doubleTapTimeout);
      }
      if (longPressTimeout) {
        window.clearTimeout(longPressTimeout);
      }
      if (containerRef) {
        containerRef.removeEventListener("click", handleClickCapture, { capture: true });
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    });
  });


  return (
    <div
      ref={containerRef}
      class={props.class}
      style={{
        display: "block",
        "touch-action": "none",
        ...props.style,
      }}
      onPointerDown={handlePointerDown}
    >
      {props.children}
    </div>
  );
}
