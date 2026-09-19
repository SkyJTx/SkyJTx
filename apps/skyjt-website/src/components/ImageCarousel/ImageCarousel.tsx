import type { JSX } from "@solidjs/web";
import { createSignal, For, Show } from "solid-js";
import { Icon } from "~/components/Icon";
import { FilePreview } from "~/components/FilePreview";
import type { ProjectImage } from "~/constants/worksData";

/**
 * Properties for ImageCarousel component.
 */
export interface ImageCarouselProps {
  images: readonly ProjectImage[];
  projectName?: string;
  projectDate?: string;
}

/**
 * Image carousel for project media with navigation arrows and full lightbox modal preview.
 */
export function ImageCarousel(props: ImageCarouselProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [lightboxOpen, setLightboxOpen] = createSignal(false);
  const [lightboxSrc, setLightboxSrc] = createSignal("");
  const [lightboxAlt, setLightboxAlt] = createSignal("");

  const goTo = (index: number) => {
    const max = props.images.length - 1;
    setCurrentIndex(Math.max(0, Math.min(index, max)));
  };

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
    setLightboxOpen(true);
  };

  return (
    <div class="relative w-full h-full overflow-hidden group select-none">
      <div
        class="flex w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${currentIndex() * 100}%)`,
        }}
      >
        <For each={props.images}>
          {(image) => (
            <div class="w-full h-full shrink-0 relative bg-base-300/40">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(image.src, image.alt)}
              />
            </div>
          )}
        </For>
      </div>

      <Show when={props.images.length > 1}>
        <button
          type="button"
          class="btn btn-circle btn-xs btn-ghost bg-base-100/70 backdrop-blur-sm absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0"
          disabled={currentIndex() === 0}
          onClick={() => goTo(currentIndex() - 1)}
          aria-label="Previous image"
        >
          <Icon name="chevron-left" size={14} />
        </button>

        <button
          type="button"
          class="btn btn-circle btn-xs btn-ghost bg-base-100/70 backdrop-blur-sm absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0"
          disabled={currentIndex() === props.images.length - 1}
          onClick={() => goTo(currentIndex() + 1)}
          aria-label="Next image"
        >
          <Icon name="chevron-right" size={14} />
        </button>

        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-base-100/60 backdrop-blur-sm">
          <For each={props.images}>
            {(_, index) => (
              <button
                type="button"
                class={[
                  "rounded-full transition-all duration-300",
                  index() === currentIndex() ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-base-content/40 hover:bg-base-content/70",
                ]}
                onClick={() => goTo(index())}
                aria-label={`Go to image ${index() + 1}`}
              />
            )}
          </For>
        </div>
      </Show>

      <FilePreview
        url={lightboxSrc()}
        name={props.projectName || lightboxAlt() || "Image Preview"}
        date={props.projectDate}
        isOpen={lightboxOpen()}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
