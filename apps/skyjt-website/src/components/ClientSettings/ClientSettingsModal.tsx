import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import { useClientSettings } from "./ClientSettingsContext";
import { PRESET_COLORS, type FontSize, type ThemeMode } from "./types";
import { SegmentButton } from "~/components/SegmentButton";
import { CheckIcon, CloseIcon } from "./ClientSettingsIcons";
import { THEME_OPTIONS, FONT_SIZE_OPTIONS } from "./constants";

/**
 * Properties for ClientSettingsModal.
 */
export interface ClientSettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * Accessible client settings modal dialog powered by @kobalte/core/dialog.
 */
export function ClientSettingsModal(props: ClientSettingsModalProps): JSX.Element {
  const settings = useClientSettings();

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-fade-in transition-opacity duration-200" />
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden pointer-events-none">
        <Dialog.Content class="relative w-full max-w-md bg-base-200 border border-base-content/15 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-scale-in transition-all duration-200 pointer-events-auto">
          {/* Header */}
          <div class="flex items-center justify-between border-b border-base-content/10 pb-3">
            <div>
              <Dialog.Title class="text-lg font-bold text-base-content">
                Client Settings
              </Dialog.Title>
              <Dialog.Description class="text-xs text-base-content/60">
                Preferences are persisted across visits.
              </Dialog.Description>
            </div>
            <Dialog.CloseButton
              aria-label="Close Settings"
              class="btn btn-ghost btn-sm btn-square rounded-lg"
            >
              <CloseIcon />
            </Dialog.CloseButton>
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
                  const isSelected = () =>
                    settings.seedColor().toLowerCase() === color.value.toLowerCase();
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
        </Dialog.Content>
      </div>
    </Dialog>
  );
}
