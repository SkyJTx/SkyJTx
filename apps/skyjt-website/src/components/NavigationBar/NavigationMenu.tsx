import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import { NavigationIndicator } from "./NavigationIndicator";

/**
 * Properties for NavigationMenu component.
 */
export interface NavigationMenuProps {
  readonly sections: readonly string[];
  readonly activeSection: string;
  readonly onSelectSection: (section: string) => void;
}

/**
 * Navigation menu rendering exclusively the section links with active state indicator.
 */
export function NavigationMenu(props: NavigationMenuProps): JSX.Element {
  return (
    <nav class="flex items-center gap-1" aria-label="Main Navigation">
      <For each={props.sections}>
        {(section) => {
          const isActive = () => props.activeSection === section;
          return (
            <button
              type="button"
              aria-current={isActive() ? "page" : undefined}
              class={[
                "relative px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-xl select-none",
                isActive()
                  ? "text-primary font-bold bg-base-content/5"
                  : "text-base-content/75 hover:text-base-content hover:bg-base-content/5",
              ]}
              onClick={() => props.onSelectSection(section)}
            >
              <span>{section}</span>
              <Show when={isActive()}>
                <NavigationIndicator />
              </Show>
            </button>
          );
        }}
      </For>
    </nav>
  );
}
