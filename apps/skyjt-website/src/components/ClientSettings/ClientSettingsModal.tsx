import type { JSX } from "@solidjs/web";
import { For, Show, onSettled } from "solid-js";
import { useClientSettings } from "./ClientSettingsContext";
import { PRESET_COLORS, type FontSize, type ThemeMode } from "./types";
import { SegmentButton, type SegmentOption } from "~/components/SegmentButton";

/**
 * Properties for ClientSettingsModal.
 */
export interface ClientSettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const SunIcon = (props: { class?: string }): JSX.Element => (
  <svg class={props.class ?? "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = (props: { class?: string }): JSX.Element => (
  <svg class={props.class ?? "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = (props: { class?: string }): JSX.Element => (
  <svg class={props.class ?? "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const CheckIcon = (props: { class?: string }): JSX.Element => (
  <svg class={props.class ?? "w-3 h-3"} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = (props: { class?: string }): JSX.Element => (
  <svg class={props.class ?? "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const THEME_OPTIONS: readonly SegmentOption<ThemeMode>[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

const FONT_SIZE_OPTIONS: readonly SegmentOption<FontSize>[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Default" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra" },
];

/**
 * Accessible client settings modal dialog.
 */
export function ClientSettingsModal(props: ClientSettingsModalProps): JSX.Element {
  const settings = useClientSettings();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && props.isOpen) {
      props.onClose();
    }
  };

  onSettled(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  });

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            props.onClose();
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="client-settings-title"
          class="relative w-full max-w-md bg-base-200 border border-base-content/15 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div class="flex items-center justify-between border-b border-base-content/10 pb-3">
            <div>
              <h2 id="client-settings-title" class="text-lg font-bold text-base-content">
                Client Settings
              </h2>
              <p class="text-xs text-base-content/60">
                Preferences are persisted across visits.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close Settings"
              class="btn btn-ghost btn-sm btn-square rounded-lg"
              onClick={() => props.onClose()}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Section: Theme */}
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Theme Mode
            </span>
            <SegmentButton<ThemeMode>
              options={THEME_OPTIONS}
              value={settings.theme()}
              onChange={(val) => settings.setTheme(val)}
              name="theme-mode"
              ariaLabel="Theme Mode"
            />
          </div>

          {/* Section: Seed Color */}
          <div class="flex flex-col gap-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                Seed Color
              </span>
              <span class="text-xs font-mono text-base-content/60">
                {settings.seedColor()}
              </span>
            </div>
            <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
              <For each={PRESET_COLORS}>
                {(color) => {
                  const isSelected = () => settings.seedColor().toLowerCase() === color.value.toLowerCase();
                  return (
                    <button
                      type="button"
                      aria-label={`Select ${color.name} color`}
                      class={[
                        "w-9 h-9 rounded-full cursor-pointer flex items-center justify-center transition-transform duration-150 relative",
                        isSelected()
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-base-200 scale-110"
                          : "hover:scale-105 opacity-85 hover:opacity-100",
                      ]}
                      style={{ "background-color": color.value }}
                      onClick={() => settings.setSeedColor(color.value)}
                    >
                      <Show when={isSelected()}>
                        <span class="text-white drop-shadow-xs">
                          <CheckIcon />
                        </span>
                      </Show>
                    </button>
                  );
                }}
              </For>
            </div>
            <div class="flex items-center gap-3 pt-1">
              <input
                type="color"
                aria-label="Custom Seed Color"
                value={settings.seedColor()}
                class="w-8 h-8 rounded-lg cursor-pointer border border-base-content/20 bg-transparent p-0.5"
                onInput={(e) => {
                  const val = (e.currentTarget as HTMLInputElement).value;
                  settings.setSeedColor(val);
                }}
              />
              <span class="text-xs text-base-content/70">
                Custom Color Picker
              </span>
            </div>
          </div>

          {/* Section: Font Size */}
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Font Size ({settings.fontSizeValue()})
            </span>
            <SegmentButton<FontSize>
              options={FONT_SIZE_OPTIONS}
              value={settings.fontSize()}
              onChange={(val) => settings.setFontSize(val)}
              name="font-size"
              ariaLabel="Font Size"
            />
          </div>

          {/* Footer Actions */}
          <div class="flex items-center justify-between border-t border-base-content/10 pt-4 mt-2">
            <button
              type="button"
              class="btn btn-ghost btn-sm text-xs text-base-content/70 hover:text-base-content"
              onClick={() => settings.resetDefaults()}
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm px-5"
              onClick={() => props.onClose()}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
