import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";

/**
 * Section title heading with styled typography.
 */
export function BrandTitle(props: ParentProps): JSX.Element {
  return (
    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content text-center mb-2">
      {props.children}
    </h2>
  );
}
