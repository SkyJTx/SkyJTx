import type { JSX } from "@solidjs/web";
import { For } from "solid-js";

/**
 * Properties for NavigationBar component.
 */
export interface NavigationBarProps {
  sections: readonly string[];
  activeSection: string;
  onSelectSection: (section: string) => void;
}

/**
 * Floating sticky navigation bar with active section indicator, theme seed picker, and theme controller.
 */
export function NavigationBar(props: NavigationBarProps): JSX.Element {
  return (
    <header class="navbar bg-base-200/85 backdrop-blur-md border-b border-base-300 px-4 sm:px-8 gap-4 sticky top-0 z-40 transition-colors duration-200">
      {/* Brand / Logo */}
      <div class="flex-none">
        <a
          href="#Home"
          class="btn btn-ghost text-lg font-bold tracking-tight text-primary px-2"
          onClick={(e) => {
            e.preventDefault();
            props.onSelectSection("Home");
          }}
        >
          SkyJT
        </a>
      </div>

      {/* Nav Menu */}
      <div class="flex-1 flex justify-center">
        <nav class="flex items-center gap-1 sm:gap-2 p-1 bg-base-300/40 rounded-full border border-base-300/60">
          <For each={props.sections}>
            {(section) => {
              const isActive = () => props.activeSection === section;
              return (
                <button
                  type="button"
                  class={[
                    "btn btn-xs sm:btn-sm rounded-full transition-all duration-200",
                    isActive()
                      ? "btn-primary shadow-sm font-semibold"
                      : "btn-ghost text-base-content/70 hover:text-base-content",
                  ]}
                  onClick={() => props.onSelectSection(section)}
                >
                  {section}
                </button>
              );
            }}
          </For>
        </nav>
      </div>

      {/* Dynamic Controls */}
      <div class="flex-none flex items-center gap-3">
        {/* Seed Color Picker */}
        <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
          <span class="text-base-content/70 hidden sm:inline">Theme Seed</span>
          <input
            type="color"
            defaultValue="#4f46e5"
            class="w-7 h-7 rounded-field cursor-pointer border border-base-300 bg-transparent p-0.5"
            onInput={(e) => {
              const color = (e.currentTarget as HTMLInputElement).value;
              document.documentElement.style.setProperty("--seed", color);
            }}
          />
        </label>

        <div class="divider divider-horizontal my-2 mx-0" />

        {/* DaisyUI Pure-CSS Theme Controller Toggle */}
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="theme-toggle"
            type="checkbox"
            value="dark-seed"
            class="theme-controller toggle toggle-primary toggle-sm"
            onInput={(e) => {
              const isDark = (e.currentTarget as HTMLInputElement).checked;
              document.documentElement.setAttribute(
                "data-theme",
                isDark ? "dark-seed" : "light-seed"
              );
            }}
          />
          <span class="text-xs font-semibold text-base-content/80">Dark</span>
        </label>
      </div>
    </header>
  );
}
