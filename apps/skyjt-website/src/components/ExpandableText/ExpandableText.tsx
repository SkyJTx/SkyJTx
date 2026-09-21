import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { Icon } from "~/components/Icon";
import type { ExpandableTextProps } from "./ExpandableText.types";
import { useExpandableText } from "./useExpandableText";

/**
 * Accessible expandable text component with word-boundary truncation and disclosure toggle.
 */
export function ExpandableText(props: ExpandableTextProps): JSX.Element {
  const { displayText, isTruncated, isExpanded, toggle } = useExpandableText(props);

  return (
    <span class={props.class}>
      <span>{displayText()}</span>
      <Show when={isTruncated()}>
        {" "}
        <button
          type="button"
          aria-expanded={isExpanded() ? "true" : "false"}
          onClick={toggle}
          class="text-primary hover:text-primary-focus font-semibold text-xs inline-flex items-center gap-0.5 underline-offset-2 hover:underline cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary/50 rounded-xs"
        >
          <span>{isExpanded() ? props.lessText ?? "Show less" : props.moreText ?? "Show more"}</span>
          <Icon
            name="chevron-down"
            size={12}
            class={isExpanded() ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"}
          />
        </button>
      </Show>
    </span>
  );
}
