import { For, createEffect, onMount } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useSignal } from "@skyjt/signals-solid";
import * as S from "./styles";

export interface Segment<T extends string> {
  value: T;
  label: string;
}

export interface SegmentButtonProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * Pill-shaped segmented toggle with an animated sliding indicator.
 */
export function SegmentButton<T extends string>(
  props: SegmentButtonProps<T>,
) {
  const theme = useTheme();
  const indicatorOffset = useSignal(0);
  const indicatorWidth = useSignal(0);
  let containerRef: HTMLDivElement | undefined;

  const updateIndicator = () => {
    if (!containerRef) return;
    const buttons = containerRef.querySelectorAll<HTMLButtonElement>(
      "[data-segment-item]",
    );
    const activeIndex = props.segments.findIndex(
      (s) => s.value === props.value,
    );
    const activeButton = buttons[activeIndex];
    if (activeButton) {
      indicatorOffset.value = activeButton.offsetLeft;
      indicatorWidth.value = activeButton.offsetWidth;
    }
  };

  onMount(updateIndicator);
  createEffect(updateIndicator);

  return (
    <S.SegmentContainer theme={theme} ref={containerRef}>
      <S.SegmentIndicator
        theme={theme}
        $offset={indicatorOffset.value}
        $width={indicatorWidth.value}
      />
      <For each={props.segments}>
        {(segment) => (
          <S.SegmentItem
            theme={theme}
            $active={props.value === segment.value}
            data-segment-item
            onClick={() => props.onChange(segment.value)}
          >
            {segment.label}
          </S.SegmentItem>
        )}
      </For>
    </S.SegmentContainer>
  );
}
