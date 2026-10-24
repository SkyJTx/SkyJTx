import type { JSX } from "@solidjs/web";
import { createMemo, Show } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import { Icon } from "~/components/Icon";
import { detectFileType, downloadFile, type FileType } from "~/utils/fileDownload";
import { useClipboard } from "~/hooks/useClipboard";

export interface FilePreviewProps {
  url: string;
  name: string;
  date?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreview(props: FilePreviewProps): JSX.Element {
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
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          <Dialog.Content class="relative w-full max-w-4xl max-h-[90vh] bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 flex flex-col overflow-hidden animate-scale-in">
            <div class="flex items-center justify-between px-4 py-3 border-b border-base-content/10 bg-base-100/80 backdrop-blur-xs shrink-0">
              <div class="flex flex-col min-w-0 pr-4">
                <Dialog.Title class="text-sm sm:text-base font-bold text-base-content truncate">
                  {props.name}
                </Dialog.Title>
                <Show when={props.date}>
                  <Dialog.Description class="text-xs text-base-content/60">
                    {props.date}
                  </Dialog.Description>
                </Show>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  class="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
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
                  class="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
                  title="Download File"
                  aria-label="Download File"
                >
                  <Icon name="download" size={16} />
                </a>

                <a
                  href={props.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
                  title="Open in New Tab"
                  aria-label="Open in New Tab"
                >
                  <Icon name="external-link" size={16} />
                </a>

                <Dialog.CloseButton
                  class="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content ml-1"
                  aria-label="Close Preview"
                >
                  <Icon name="x" size={16} />
                </Dialog.CloseButton>
              </div>
            </div>

            <div class="flex-1 overflow-auto bg-base-200/50 flex items-center justify-center p-2 sm:p-4 min-h-[300px]">
              <Show
                when={fileType() === "image"}
                fallback={
                  <iframe
                    src={props.url}
                    class="w-full h-full min-h-[500px] rounded-lg border border-base-content/10 bg-base-100"
                    title={props.name}
                  />
                }
              >
                <img
                  src={props.url}
                  alt={props.name}
                  class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
                />
              </Show>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}
