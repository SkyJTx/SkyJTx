import type { JSX } from "@solidjs/web";

/**
 * Properties for NavigationAction component.
 */
export interface NavigationActionProps {
  readonly onOpenSettings: () => void;
}

/**
 * Monitor action button toggling Client Settings modal.
 */
export function NavigationAction(props: NavigationActionProps): JSX.Element {
  return (
    <button
      type="button"
      aria-label="Open Client Settings"
      class="btn btn-ghost btn-xs sm:btn-sm btn-square rounded-lg sm:rounded-xl text-base-content/80 hover:text-base-content hover:bg-base-content/10 transition-colors duration-200 cursor-pointer shrink-0"
      onClick={() => props.onOpenSettings()}
    >
      <svg
        class="w-3.5 h-3.5 sm:w-4 sm:h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </button>
  );
}
