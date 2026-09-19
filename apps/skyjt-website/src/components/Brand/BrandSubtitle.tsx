import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";

/**
 * Section subtitle description with subtle styling.
 */
export function BrandSubtitle(props: ParentProps): JSX.Element {
  return (
    <p class="text-sm sm:text-base text-base-content/70 text-center max-w-md mx-auto mb-8">
      {props.children}
    </p>
  );
}
