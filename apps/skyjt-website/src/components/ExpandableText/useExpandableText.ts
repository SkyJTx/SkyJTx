import { createMemo, createSignal } from "solid-js";
import type { ExpandableTextProps, UseExpandableTextReturn } from "./ExpandableText.types";

/**
 * Truncates text at the nearest word boundary prior to or at maxLength, appending an ellipsis.
 */
export function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const sub = text.slice(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  const cleanSlice = lastSpace > 0 ? sub.slice(0, lastSpace) : sub;

  return `${cleanSlice.trimEnd()}...`;
}

/**
 * Hook providing reactive state and word-boundary truncation logic for expandable text.
 */
export function useExpandableText(props: ExpandableTextProps): UseExpandableTextReturn {
  const limit = () => props.maxLength ?? 200;
  const [isExpanded, setIsExpanded] = createSignal(false);

  const isTruncated = createMemo(() => (props.text?.length ?? 0) > limit());

  const displayText = createMemo(() => {
    if (!isTruncated() || isExpanded()) {
      return props.text;
    }
    return truncateAtWord(props.text, limit());
  });

  const toggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return {
    displayText,
    isTruncated,
    isExpanded,
    toggle,
  };
}
