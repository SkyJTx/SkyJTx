import type { JSX } from "@solidjs/web";
import {
  createSignal,
  createUniqueId,
  Show,
  onCleanup,
} from "solid-js";

/**
 * Placement options for Tooltip floating box.
 */
export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/**
 * Properties for custom Tooltip component.
 */
export interface TooltipProps {
  content: JSX.Element;
  children: JSX.Element;
  placement?: TooltipPlacement;
  openDelay?: number;
  closeDelay?: number;
  class?: string;
}

/**
 * Accessible tooltip component supporting hover delays, keyboard focus, and ARIA relationships.
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  const [isOpen, setIsOpen] = createSignal(false);
  const tooltipId = `tooltip-${createUniqueId()}`;
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  const openDelay = () => props.openDelay ?? 300;
  const closeDelay = () => props.closeDelay ?? 150;
  const placement = () => props.placement ?? "bottom";

  const handleMouseEnter = () => {
    clearTimeout(closeTimer);
    openTimer = setTimeout(() => setIsOpen(true), openDelay());
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimer);
    closeTimer = setTimeout(() => setIsOpen(false), closeDelay());
  };

  const handleFocusIn = () => {
    clearTimeout(closeTimer);
    setIsOpen(true);
  };

  const handleFocusOut = () => {
    clearTimeout(openTimer);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      clearTimeout(openTimer);
      setIsOpen(false);
    }
  };

  onCleanup(() => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
  });

  const placementClasses = () => {
    switch (placement()) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "bottom":
      default:
        return "top-full left-1/2 -translate-x-1/2 mt-2";
    }
  };

  const arrowClasses = () => {
    switch (placement()) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-t-neutral";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-l-neutral";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-r-neutral";
      case "bottom":
      default:
        return "bottom-full left-1/2 -translate-x-1/2 border-b-neutral";
    }
  };

  return (
    <div
      class="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusIn={handleFocusIn}
      onFocusOut={handleFocusOut}
      onKeyDown={handleKeyDown}
      aria-describedby={isOpen() ? tooltipId : undefined}
    >
      {props.children}
      <Show when={isOpen()}>
        <div
          id={tooltipId}
          role="tooltip"
          class={[
            "absolute z-50 px-2.5 py-1 text-xs rounded-field bg-neutral text-neutral-content shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150 animate-fade-in",
            placementClasses(),
            props.class,
          ]}
        >
          {props.content}
          <div
            class={[
              "absolute w-0 h-0 border-4 border-transparent",
              arrowClasses(),
            ]}
          />
        </div>
      </Show>
    </div>
  );
}