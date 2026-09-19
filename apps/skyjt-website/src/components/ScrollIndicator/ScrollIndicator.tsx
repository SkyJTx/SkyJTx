import type { JSX } from "@solidjs/web";
import { Icon } from "~/components/Icon";

/**
 * Properties for ScrollIndicator component.
 */
export interface ScrollIndicatorProps {
  label?: string;
  onClick?: () => void;
}

/**
 * Animated bounce scroll indicator button navigating to the next page section.
 */
export function ScrollIndicator(props: ScrollIndicatorProps): JSX.Element {
  return (
    <button
      type="button"
      class="flex flex-col items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-base-content/60 hover:text-primary transition-colors duration-200 cursor-pointer animate-bounce select-none focus:outline-none"
      onClick={() => props.onClick?.()}
      aria-label={props.label || "Scroll Down"}
    >
      <span>{props.label || "Scroll Down"}</span>
      <Icon name="chevron-down" size={16} />
    </button>
  );
}
