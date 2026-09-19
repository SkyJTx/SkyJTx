import type { JSX } from "@solidjs/web";

/**
 * Option descriptor for SegmentButton component.
 */
export interface SegmentOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
  readonly icon?: (props: { class?: string }) => JSX.Element;
  readonly ariaLabel?: string;
}

/**
 * Properties for SegmentButton component.
 */
export interface SegmentButtonProps<T extends string | number> {
  readonly options: readonly SegmentOption<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly name?: string;
  readonly ariaLabel?: string;
  readonly class?: string;
  readonly size?: "sm" | "md";
}
