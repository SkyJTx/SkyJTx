import type { JSX } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
import { usePillIndicator } from "./usePillIndicator";

export interface NavigationMenuProps {
  readonly sections: readonly string[];
  readonly activeSection: string;
  readonly onSelectSection: (section: string) => void;
}

export function NavigationMenu(props: NavigationMenuProps): JSX.Element {
  const [navEl, setNavEl] = createSignal<HTMLElement | undefined>();

  const { indicatorStyle, registerButton } = usePillIndicator({
    sections: () => props.sections,
    activeSection: () => props.activeSection,
    navRef: navEl,
  });

  return (
    <nav
      ref={setNavEl}
      class="relative flex items-center gap-1"
      aria-label="Main Navigation"
    >
      <Show when={indicatorStyle().ready}>
        <div
          class="absolute inset-y-0 bg-primary rounded-full transition-all duration-300 ease-out shadow-sm pointer-events-none z-0"
          style={{
            left: `${indicatorStyle().left}px`,
            width: `${indicatorStyle().width}px`,
          }}
          aria-hidden="true"
        />
      </Show>

      <div class="flex items-center gap-1 z-10">
        <For each={props.sections}>
          {(section) => {
            const isActive = () => props.activeSection === section;
            return (
                                          <button
                type="button"
                ref={(el) => registerButton(section, el)}
                onClick={() => props.onSelectSection(section)}
                class={[
                  "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  {
                    "text-primary-content font-semibold": isActive(),
                    "text-base-content/70 hover:text-base-content hover:bg-base-content/5": !isActive(),
                  },
                ]}
                aria-current={isActive() ? "page" : undefined}
              >
                {section}
              </button>
            );
          }}
        </For>
      </div>
    </nav>
  );
}
