import type { JSX } from "@solidjs/web";

/**
 * Properties for DynamicIslandTrigger component.
 */
export interface DynamicIslandTriggerProps {
  readonly activeSection: string;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
}

/**
 * Compact mobile floating island trigger button showing live active section tracking.
 */
export function DynamicIslandTrigger(props: DynamicIslandTriggerProps): JSX.Element {
  return (
    <button
      type="button"
      aria-expanded={props.isExpanded ? "true" : "false"}
      aria-controls="dynamic-island-menu"
      aria-label={`Current section: ${props.activeSection}. Tap to open navigation menu.`}
      class="flex items-center gap-2 bg-slate-900/80 dark:bg-base-300/80 backdrop-blur-xl border border-white/10 dark:border-base-content/15 shadow-2xl rounded-full px-3.5 py-1.5 cursor-pointer select-none active:scale-95 transition-transform"
      onClick={() => props.onToggle()}
    >
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_var(--color-primary)]" />
      <span class="text-xs font-semibold text-base-content tracking-wide">
        {props.activeSection}
      </span>
      <svg
        class="w-3.5 h-3.5 text-base-content/60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
