import { onMount, onCleanup, Show } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useSignal } from "@skyjt/signals-solid";
import { Icon } from "~/components/Icon";
import { FilePreview } from "~/components/FilePreview";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import * as S from "./styles";

export interface PdfPreviewProps {
  url: string;
  title: string;
  date?: string;
}

/**
 * High-performance PDF preview component that parses and renders PDF pages
 * onto a Canvas using a Web Worker off the main thread.
 * Completely SSR-safe and optimized for smooth transitions and animations.
 */
export function PdfPreview(props: PdfPreviewProps) {
  const theme = useTheme();
  const canvasRef = useSignal<HTMLCanvasElement | undefined>(undefined);
  const loading = useSignal(true);
  const loadFailed = useSignal(false);
  const modalOpen = useSignal(false);
  
  let renderTask: RenderTask | null = null;
  let pdfDoc: PDFDocumentProxy | null = null;

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.value) return;

    try {
      loading.value = true;
      const page = await pdfDoc.getPage(pageNum);
      
      const canvas = canvasRef.value;
      const context = canvas.getContext("2d");
      if (!context) return;

      const dpr = window.devicePixelRatio || 1;
      const containerWidth = canvas.parentElement?.clientWidth || 400;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.scale(dpr, dpr);

      if (renderTask) {
        renderTask.cancel();
      }

      const renderContext = {
        canvasContext: context,
        canvas: canvas,
        viewport: viewport,
      };

      renderTask = page.render(renderContext);
      await renderTask.promise;
      loading.value = false;
    } catch (err) {
      const isCancelled = err instanceof Error && err.name === "RenderingCancelledException";
      if (!isCancelled) {
        console.error("PDF page rendering failed:", err);
        loadFailed.value = true;
        loading.value = false;
      }
    }
  };

  onMount(async () => {
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.mjs";

      const loadingTask = pdfjs.getDocument({
        url: props.url,
      });

      pdfDoc = await loadingTask.promise;
      await renderPage(1);

      const handleResize = () => {
        renderPage(1);
      };
      window.addEventListener("resize", handleResize);

      onCleanup(() => {
        window.removeEventListener("resize", handleResize);
        if (renderTask) {
          renderTask.cancel();
        }
        if (pdfDoc) {
          pdfDoc.loadingTask.destroy();
        }
      });
    } catch (err) {
      console.error("Failed to load PDF document:", err);
      loadFailed.value = true;
      loading.value = false;
    }
  });

  const openModal = () => {
    modalOpen.value = true;
  };

  return (
    <S.PreviewContainer theme={theme}>
      <Show when={loadFailed.value}>
        <S.FallbackContainer theme={theme}>
          <Icon name="file-text" size={32} />
          <S.ViewButton
            theme={theme}
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external-link" size={14} />
            View Document
          </S.ViewButton>
        </S.FallbackContainer>
      </Show>

      <Show when={!loadFailed.value}>
        <S.CanvasWrapper onClick={openModal}>
          <canvas ref={(el) => canvasRef.value = el} />
          
          <Show when={loading.value}>
            <S.LoadingOverlay theme={theme}>
              <S.Spinner theme={theme} />
            </S.LoadingOverlay>
          </Show>

          <Show when={!loading.value}>
            <S.HoverOverlay theme={theme}>
              <Icon name="external-link" size={24} />
              <S.HoverText theme={theme}>Click to View Full PDF</S.HoverText>
            </S.HoverOverlay>
          </Show>
        </S.CanvasWrapper>
      </Show>

      <FilePreview
        url={props.url}
        name={props.title}
        date={props.date}
        isOpen={modalOpen.value}
        onClose={() => {
          modalOpen.value = false;
        }}
      />
    </S.PreviewContainer>
  );
}
