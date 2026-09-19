import type { JSX } from "@solidjs/web";

/**
 * Underscore and downward anchor caret indicator with radiant ambient glow.
 */
export function NavigationIndicator(): JSX.Element {
  return (
    <div
      class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-20"
      aria-hidden="true"
    >
      {/* Underscore Baseline */}
      <div class="w-7 h-[2px] bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
      {/* Downward Anchor Caret */}
      <svg
        class="w-3 h-2 text-primary -mt-[1px] drop-shadow-[0_0_6px_var(--color-primary)]"
        viewBox="0 0 12 8"
        fill="currentColor"
      >
        <path d="M0 0 L6 6 L12 0 Z" />
      </svg>
      {/* Soft Downward Radial Blur Glow */}
      <div class="w-10 h-3 -mt-2 bg-primary/45 blur-md rounded-full pointer-events-none" />
    </div>
  );
}
