import type { JSX } from "@solidjs/web";
import { For, createMemo, createSignal, onSettled } from "solid-js";
import type { SegmentButtonProps } from "./SegmentButton.types";

/**
 * Accessible generic segmented button with animated sliding indicator.
 */
export function SegmentButton<T extends string | number>(
  props: SegmentButtonProps<T>
): JSX.Element {
  let containerRef: HTMLDivElement | undefined;
  const [hasMounted, setHasMounted] = createSignal(false);

  onSettled(() => {
    setHasMounted(true);
  });

  const activeIndex = createMemo(() => {
    const idx = props.options.findIndex((opt) => opt.value === props.value);
    return idx >= 0 ? idx : 0;
  });

  const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
    const total = props.options.length;
    if (total === 0) return;

    let targetIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % total;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + total) % total;
    } else if (event.key === "Home") {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      targetIndex = total - 1;
    } else {
      return;
    }

    const targetOption = props.options[targetIndex];
    if (targetOption) {
      props.onChange(targetOption.value);
      const radioButtons = containerRef?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      const targetElement = radioButtons ? radioButtons[targetIndex] : undefined;
      targetElement?.focus();
    }
  };

  const optionCount = () => Math.max(1, props.options.length);

  return (
    <div
      ref={(el) => {
        containerRef = el;
      }}
      role="radiogroup"
      aria-label={props.ariaLabel ?? props.name}
      class={[
        "relative flex items-center p-1 bg-base-300/50 rounded-xl select-none border border-base-content/10",
        props.class ?? "",
      ]}
    >
      {/* Sliding Highlight Pill */}
      <div class="absolute inset-1 pointer-events-none" aria-hidden="true">
        <div
          class={[
            "h-full rounded-lg bg-base-100 shadow-xs border border-base-content/5",
            hasMounted()
              ? "transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              : "",
          ]}
          style={{
            width: `${100 / optionCount()}%`,
            transform: `translateX(${activeIndex() * 100}%)`,
          }}
        />
      </div>

      {/* Segment Options */}
      <For each={props.options}>
        {(option, index) => {
          const isSelected = () => props.value === option.value;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={isSelected() ? "true" : "false"}
              aria-label={option.ariaLabel ?? option.label}
              tabindex={isSelected() ? 0 : -1}
              class={[
                "relative z-10 flex-1 flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary select-none",
                props.size === "sm" ? "py-1 px-2 text-xs" : "py-1.5 px-3 text-sm",
                isSelected()
                  ? "text-primary font-semibold"
                  : "text-base-content/70 hover:text-base-content",
              ]}
              onClick={() => props.onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index())}
            >
              {option.icon ? option.icon({ class: props.size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4" }) : null}
              <span>{option.label}</span>
            </button>
          );
        }}
      </For>
    </div>
  );
}