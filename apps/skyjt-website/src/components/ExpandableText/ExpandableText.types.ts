/**
 * Properties for the ExpandableText component.
 */
export interface ExpandableTextProps {
  readonly text: string;
  readonly maxLength?: number;
  readonly class?: string;
  readonly moreText?: string;
  readonly lessText?: string;
}

/**
 * Return interface for the useExpandableText hook.
 */
export interface UseExpandableTextReturn {
  readonly displayText: () => string;
  readonly isTruncated: () => boolean;
  readonly isExpanded: () => boolean;
  readonly toggle: () => void;
}
