import { Show, createEffect, onCleanup, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useTheme } from "solid-styled-components";
import { Icon, IconName } from "~/components/Icon";
import { IconButton } from "~/components/Button";
import * as S from "./styles";

export interface FilePreviewProps {
  url: string;
  name: string;
  date?: string;
  isOpen: boolean;
  onClose: () => void;
}

type FileType = "image" | "pdf" | "unknown";

function detectFileType(url: string): FileType {
  if (!url) return "unknown";
  const cleanUrl = url.split(/[?#]/)[0];
  if (cleanUrl.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp"];
  if (imageExtensions.some(ext => cleanUrl.toLowerCase().endsWith(ext))) {
    return "image";
  }
  return "unknown";
}

/**
 * Unified, auto-detecting File Preview modal supporting Images and PDFs.
 * Includes glassmorphic header controls for downloading, sharing, and closing.
 */
export function FilePreview(props: FilePreviewProps) {
  const theme = useTheme();
  const [copied, setCopied] = createSignal(false);

  createEffect(() => {
    if (props.isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      onCleanup(() => {
        document.removeEventListener("keydown", handleKeyDown);
      });
    }
  });

  const fileType = () => {
    const detected = detectFileType(props.url);
    if (detected === "unknown") {
      // Fallback: If it's a supabase URL or has a token, it might not have clear extension.
      // We check if pdf is in query or default to image
      if (props.url.toLowerCase().includes(".pdf")) return "pdf";
      return "image";
    }
    return detected;
  };

  const getHeaderIcon = (): IconName => {
    return fileType() === "pdf" ? "file-text" : "image";
  };

  const handleSave = async (e: MouseEvent) => {
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
    } catch (error) {
      console.error("Direct download failed, opening link to let browser handle it:", error);
      const link = document.createElement("a");
      link.href = props.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      // Try setting download attribute anyway
      link.download = props.url.split("/").pop()?.split(/[?#]/)[0] || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: props.name,
          url: props.url
        });
        return;
      } catch (err) {
        console.warn("Share API failed, using clipboard:", err);
      }
    }

    try {
      await navigator.clipboard.writeText(props.url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <S.Backdrop theme={theme} onClick={handleOverlayClick}>
          <S.Header theme={theme}>
            <S.MetaSection>
              <S.IconContainer theme={theme}>
                <Icon name={getHeaderIcon()} size={20} />
              </S.IconContainer>
              <S.TextContainer>
                <S.FileName theme={theme}>{props.name}</S.FileName>
                <Show when={props.date}>
                  <S.FileDate theme={theme}>{props.date}</S.FileDate>
                </Show>
              </S.TextContainer>
            </S.MetaSection>

            <S.ActionsSection>
              <IconButton
                onClick={handleSave}
                title="Save file"
                ariaLabel="Save file"
                size="sm"
              >
                <Icon name="download" size={16} />
              </IconButton>
              <IconButton
                onClick={handleShare}
                title="Share link"
                ariaLabel="Share link"
                size="sm"
              >
                <Show when={copied()} fallback={<Icon name="share" size={16} />}>
                  <Icon name="check" size={16} style={{ color: theme.colors.success }} />
                </Show>
              </IconButton>
              <IconButton
                onClick={() => props.onClose()}
                title="Close"
                ariaLabel="Close preview"
                size="sm"
              >
                <Icon name="x" size={16} />
              </IconButton>
            </S.ActionsSection>
          </S.Header>

          <S.Viewport onClick={handleOverlayClick}>
            <Show when={fileType() === "image"}>
              <S.ImageWrapper onClick={(e) => e.stopPropagation()}>
                <S.Image
                  theme={theme}
                  src={props.url}
                  alt={props.name}
                />
              </S.ImageWrapper>
            </Show>

            <Show when={fileType() === "pdf"}>
              <S.PdfWrapper theme={theme} onClick={(e) => e.stopPropagation()}>
                <S.PdfIframe
                  src={`${props.url}#toolbar=1`}
                  title={props.name}
                />
              </S.PdfWrapper>
            </Show>
          </S.Viewport>

          <Show when={copied()}>
            <S.Toast theme={theme}>
              <Icon name="check" size={16} style={{ color: theme.colors.success }} />
              Link copied to clipboard
            </S.Toast>
          </Show>
        </S.Backdrop>
      </Portal>
    </Show>
  );
}
