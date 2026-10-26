import type { JSX } from "@solidjs/web";
import { createMemo, Show } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import { Icon } from "~/components/Icon";
import { detectFileType, downloadFile, type FileType } from "~/utils/fileDownload";
import { useClipboard } from "~/hooks/useClipboard";

export interface FilePreviewProps {
  readonly url: string;
  readonly name: string;
  readonly date?: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function FilePreview(props: FilePreviewProps): JSX.Element {
  return (
    <Show when={props.isOpen}>
      <FilePreviewModal
        url={props.url}
        name={props.name}
        date={props.date}
        onClose={props.onClose}
      />
    </Show>
  );
}

interface FilePreviewModalProps {
  readonly url: string;
  readonly name: string;
  readonly date?: string;
  readonly onClose: () => void;
}

function FilePreviewModal(props: FilePreviewModalProps): JSX.Element {
  const { copied, copy } = useClipboard(2000);
  const fileType = createMemo<FileType>(() => detectFileType(props.url));

  const handleDownload = (e: MouseEvent) => {
    e.preventDefault();
    void downloadFile(props.url, props.name);
  };

  const handleShare = () => {
    void copy(props.url);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-fade-in transition-opacity cursor-pointer"
          onClick={() => props.onClose()}
        />
        <Dialog.Content class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 pointer-events-none select-none outline-none">
          <div class="fixed top-3 sm:top-4 right-3 sm:right-4 z-50 flex items-center bg-slate-900/60 dark:bg-base-300/40 backdrop-blur-xl border border-white/10 dark:border-base-content/15 shadow-2xl rounded-full p-1 sm:p-1.5 gap-1 sm:gap-1.5 pointer-events-auto animate-scale-in">
            <button
              type="button"
              class="btn btn-ghost btn-xs sm:btn-sm btn-circle text-white/80 dark:text-base-content/80 hover:text-white dark:hover:text-base-content hover:bg-white/10 dark:hover:bg-base-content/10 transition-colors duration-200"
              onClick={handleShare}
              title={copied() ? "Copied!" : "Copy URL"}
              aria-label="Copy URL"
            >
              <Show when={copied()} fallback={<Icon name="share" size={16} />}>
                <Icon name="check" size={16} class="text-success" />
              </Show>
            </button>

            <a
              href={props.url}
              download
              onClick={handleDownload}
              class="btn btn-ghost btn-xs sm:btn-sm btn-circle text-white/80 dark:text-base-content/80 hover:text-white dark:hover:text-base-content hover:bg-white/10 dark:hover:bg-base-content/10 transition-colors duration-200"
              title="Download File"
              aria-label="Download File"
            >
              <Icon name="download" size={16} />
            </a>

            <a
              href={props.url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-xs sm:btn-sm btn-circle text-white/80 dark:text-base-content/80 hover:text-white dark:hover:text-base-content hover:bg-white/10 dark:hover:bg-base-content/10 transition-colors duration-200"
              title="Open in New Tab"
              aria-label="Open in New Tab"
            >
              <Icon name="external-link" size={16} />
            </a>

            <div class="w-px h-4 sm:h-5 bg-white/15 dark:bg-base-content/15 mx-0.5 self-center shrink-0" />

            <Dialog.CloseButton
              class="btn btn-ghost btn-xs sm:btn-sm btn-circle text-white/80 dark:text-base-content/80 hover:text-white dark:hover:text-base-content hover:bg-white/10 dark:hover:bg-base-content/10 transition-colors duration-200"
              aria-label="Close Preview"
            >
              <Icon name="x" size={16} />
            </Dialog.CloseButton>
          </div>

          <div class="flex items-center justify-center max-w-full max-h-full">
            <Show
              when={fileType() === "image"}
              fallback={
                <iframe
                  src={props.url}
                  class="w-[90vw] max-w-5xl h-[80vh] rounded-xl sm:rounded-2xl border border-white/10 dark:border-base-content/15 shadow-2xl bg-base-100 pointer-events-auto"
                  title={props.name}
                />
              }
            >
              <img
                src={props.url}
                alt={props.name}
                class="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] object-contain rounded-xl sm:rounded-2xl shadow-2xl pointer-events-auto select-none animate-scale-in"
              />
            </Show>
          </div>

          <div class="fixed bottom-3 sm:bottom-4 left-3 sm:left-4 z-50 flex flex-col items-start text-left bg-slate-900/60 dark:bg-base-300/40 backdrop-blur-xl border border-white/10 dark:border-base-content/15 shadow-2xl rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 max-w-[calc(100vw-2rem)] sm:max-w-md pointer-events-auto animate-scale-in">
            <Dialog.Title class="text-xs sm:text-sm font-semibold text-white/90 dark:text-base-content truncate max-w-full">
              {props.name}
            </Dialog.Title>
            <Show when={props.date}>
              <Dialog.Description class="text-[10px] sm:text-xs text-white/60 dark:text-base-content/60 truncate max-w-full mt-0.5">
                {props.date}
              </Dialog.Description>
            </Show>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
