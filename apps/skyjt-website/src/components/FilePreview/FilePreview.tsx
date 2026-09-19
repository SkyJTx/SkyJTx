import type { JSX } from "@solidjs/web";
import {
  createSignal,
  createMemo,
  Show,
} from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import { Icon } from "~/components/Icon";

/**
 * Properties for FilePreview lightbox component.
 */
export interface FilePreviewProps {
  url: string;
  name: string;
  date?: string;
  isOpen: boolean;
  onClose: () => void;
}

type FileType = "image" | "pdf";

function detectFileType(url: string): FileType {
  const cleanUrl = url.split(/[?#]/)[0].toLowerCase();
  if (cleanUrl.endsWith(".pdf") || url.toLowerCase().includes(".pdf")) {
    return "pdf";
  }
  return "image";
}

/**
 * Accessible modal lightbox powered by Kobalte Dialog and styled with daisyUI tokens.
 */
export function FilePreview(props: FilePreviewProps): JSX.Element {
  const [copied, setCopied] = createSignal(false);

  const fileType = createMemo<FileType>(() => detectFileType(props.url));

  const handleDownload = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(props.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = props.url.split("/").pop()?.split(/[?#]/)[0] || "download";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(props.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(props.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback silently
      }
    }
  };

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-neutral/80 backdrop-blur-md z-50 animate-fade-in transition-opacity duration-200" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content class="bg-base-100 border border-base-300 rounded-box shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div class="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/50">
              <div class="flex items-center gap-3 truncate">
                <div class="p-2 rounded-field bg-base-300/60 text-primary">
                  <Icon
                    name={fileType() === "pdf" ? "file-text" : "image"}
                    size={18}
                  />
                </div>
                <div class="truncate">
                  <Dialog.Title class="text-sm sm:text-base font-semibold text-base-content truncate">
                    {props.name}
                  </Dialog.Title>
                  <Show when={props.date}>
                    <p class="text-xs text-base-content/60">{props.date}</p>
                  </Show>
                </div>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="btn btn-ghost btn-circle btn-sm"
                  title="Download File"
                  onClick={handleDownload}
                  aria-label="Download File"
                >
                  <Icon name="download" size={16} />
                </button>

                <button
                  type="button"
                  class="btn btn-ghost btn-circle btn-sm text-base-content"
                  title="Share / Copy Link"
                  onClick={handleShare}
                  aria-label="Copy Link"
                >
                  <Show
                    when={copied()}
                    fallback={<Icon name="share" size={16} />}
                  >
                    <Icon name="check" size={16} class="text-success" />
                  </Show>
                </button>

                <Dialog.CloseButton
                  class="btn btn-ghost btn-circle btn-sm text-base-content"
                  aria-label="Close modal"
                >
                  <Icon name="x" size={18} />
                </Dialog.CloseButton>
              </div>
            </div>

            <Dialog.Description class="sr-only">
              File preview modal for {props.name}
            </Dialog.Description>

            {/* Media Body */}
            <div class="flex-1 overflow-auto bg-base-300/30 flex items-center justify-center p-4 min-h-[300px]">
              <Show
                when={fileType() === "image"}
                fallback={
                  <iframe
                    src={`${props.url}#toolbar=1`}
                    title={props.name}
                    class="w-full h-[600px] rounded-field border border-base-300"
                  />
                }
              >
                <img
                  src={props.url}
                  alt={props.name}
                  class="max-w-full max-h-[70vh] object-contain rounded-box shadow-md"
                />
              </Show>
            </div>

            {/* Toast Feedback */}
            <Show when={copied()}>
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral text-neutral-content px-4 py-2 rounded-box shadow-lg text-xs font-semibold flex items-center gap-2">
                <Icon name="check" size={14} class="text-success" />
                Link copied to clipboard
              </div>
            </Show>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}
