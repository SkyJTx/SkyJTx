import type { JSX } from "@solidjs/web";
import { createSignal } from "solid-js";
import { NavigationMenu } from "./NavigationMenu";
import { NavigationAction } from "./NavigationAction";
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
 * Centered floating navigation bar with active section anchor indicator and client settings action.
 */
export function NavigationBar(props: NavigationBarProps): JSX.Element {
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);

  return (
    <>
      <header
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center bg-slate-900/60 dark:bg-base-300/40 backdrop-blur-xl border border-white/10 dark:border-base-content/15 shadow-2xl rounded-2xl px-2 py-1.5 gap-1.5 transition-all duration-200 print:hidden no-screenshot"
        data-html2canvas-ignore="true"
      >
        <NavigationMenu
          sections={props.sections}
          activeSection={props.activeSection}
          onSelectSection={props.onSelectSection}
        />
        <div class="w-px h-5 bg-white/15 dark:bg-base-content/15 mx-1 self-center" />
        <NavigationAction onOpenSettings={() => setIsSettingsOpen(true)} />
      </header>

      <ClientSettingsModal
        isOpen={isSettingsOpen()}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
