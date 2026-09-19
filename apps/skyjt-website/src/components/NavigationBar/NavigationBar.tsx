import type { JSX } from "@solidjs/web";
import { createSignal, onSettled, Show } from "solid-js";
import { NavigationMenu } from "./NavigationMenu";
import { NavigationAction } from "./NavigationAction";
import { DynamicIslandTrigger } from "./DynamicIslandTrigger";
import { ClientSettingsModal } from "~/components/ClientSettings";

/**
 * Properties for NavigationBar component.
 */
export interface NavigationBarProps {
  readonly sections: readonly string[];
  readonly activeSection: string;
  readonly onSelectSection: (section: string) => void;
}

/**
 * Navigation bar orchestrating responsive collapsible dynamic island on mobile and floating pill on desktop.
 */
export function NavigationBar(props: NavigationBarProps): JSX.Element {
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
  const [isExpanded, setIsExpanded] = createSignal(false);

  const handleSelect = (section: string) => {
    props.onSelectSection(section);
    setIsExpanded(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    setIsExpanded(false);
  };

  onSettled(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isExpanded()) {
          setIsExpanded(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  });

  return (
    <>
      <Show when={isExpanded()}>
        <div
          class="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs sm:hidden print:hidden animate-fade-in transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      </Show>

      <header
        class="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 print:hidden no-screenshot"
        data-html2canvas-ignore="true"
      >
        <div class="sm:hidden">
          <Show
            when={isExpanded()}
            fallback={
              <DynamicIslandTrigger
                activeSection={props.activeSection}
                isExpanded={false}
                onToggle={() => setIsExpanded(true)}
              />
            }
          >
            <div
              id="dynamic-island-menu"
              class="flex items-center max-w-[calc(100vw-1rem)] bg-slate-900/90 dark:bg-base-300/90 backdrop-blur-2xl border border-white/15 dark:border-base-content/20 shadow-2xl rounded-2xl p-1.5 gap-1 animate-dynamic-island"
            >
              <NavigationMenu
                sections={props.sections}
                activeSection={props.activeSection}
                onSelectSection={handleSelect}
              />
              <div class="w-px h-4 bg-white/15 dark:bg-base-content/15 mx-0.5 self-center shrink-0" />
              <NavigationAction onOpenSettings={handleOpenSettings} />
              <button
                type="button"
                aria-label="Close navigation menu"
                class="btn btn-ghost btn-xs btn-square rounded-lg text-base-content/70 hover:text-base-content shrink-0"
                onClick={() => setIsExpanded(false)}
              >
                <svg
                  class="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </Show>
        </div>

        <div class="hidden sm:flex items-center bg-slate-900/60 dark:bg-base-300/40 backdrop-blur-xl border border-white/10 dark:border-base-content/15 shadow-2xl rounded-2xl px-2 py-1.5 gap-1.5">
          <NavigationMenu
            sections={props.sections}
            activeSection={props.activeSection}
            onSelectSection={props.onSelectSection}
          />
          <div class="w-px h-5 bg-white/15 dark:bg-base-content/15 mx-1 self-center shrink-0" />
          <NavigationAction onOpenSettings={() => setIsSettingsOpen(true)} />
        </div>
      </header>

      <ClientSettingsModal
        isOpen={isSettingsOpen()}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
