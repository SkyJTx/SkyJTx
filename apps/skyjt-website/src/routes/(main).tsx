import type { RouteSectionProps } from "@solidjs/router";
import type { JSX } from "@solidjs/web";
import { Link } from "~/router";

/**
 * Top-level main layout providing navigation across the primary application views.
 */
export default function MainLayout(props: RouteSectionProps): JSX.Element {
  return (
    <div class="min-h-screen bg-base-100 text-base-content font-sans flex flex-col">
      {/* Top Navbar */}
      <header class="navbar bg-base-200 border-b border-base-300 px-4 gap-4 sticky top-0 z-50">
        <div class="flex-1">
          <nav class="flex items-center gap-2">
            <Link
              to="/"
              class="btn btn-ghost btn-sm text-sm font-medium hover:bg-base-300 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/user/:id"
              params={{ id: 42 }}
              class="btn btn-ghost btn-sm text-sm font-medium hover:bg-base-300 transition-colors"
            >
              User 42
            </Link>
          </nav>
        </div>

        {/* Dynamic Controls */}
        <div class="flex items-center gap-3">
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

      {/* Main Content Area */}
      <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
        {props.children}
      </main>
    </div>
  );
}