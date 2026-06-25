import { For, Show } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useSignal } from "@skyjt/signals-solid";
import { Icon } from "~/components/Icon";
import { Lightbox } from "~/components/Lightbox";
import * as S from "./styles";

export interface CarouselImage {
  src: string;
  alt: string;
}

export interface ImageCarouselProps {
  images: CarouselImage[];
}

/**
 * Horizontal image carousel with navigation arrows, dot indicators, and lightbox on click.
 */
export function ImageCarousel(props: ImageCarouselProps) {
  const theme = useTheme();
  const currentIndex = useSignal(0);
  const lightboxOpen = useSignal(false);
  const lightboxSrc = useSignal("");
  const lightboxAlt = useSignal("");

  const goTo = (index: number) => {
    const max = props.images.length - 1;
    currentIndex.value = Math.max(0, Math.min(index, max));
  };

  const openLightbox = (src: string, alt: string) => {
    lightboxSrc.value = src;
    lightboxAlt.value = alt;
    lightboxOpen.value = true;
  };

  return (
    <>
      <S.CarouselWrapper>
        <S.CarouselTrack $offset={-currentIndex.value * 100}>
          <For each={props.images}>
            {(image) => (
              <S.Slide>
                <S.SlideImage
                  theme={theme}
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  onClick={() => openLightbox(image.src, image.alt)}
                />
              </S.Slide>
            )}
          </For>
        </S.CarouselTrack>

        <Show when={props.images.length > 1}>
          <S.NavButton
            theme={theme}
            $position="left"
            disabled={currentIndex.value === 0}
            onClick={() => goTo(currentIndex.value - 1)}
            aria-label="Previous image"
          >
            <Icon name="chevron-left" size={16} />
          </S.NavButton>
          <S.NavButton
            theme={theme}
            $position="right"
            disabled={currentIndex.value === props.images.length - 1}
            onClick={() => goTo(currentIndex.value + 1)}
            aria-label="Next image"
          >
            <Icon name="chevron-right" size={16} />
          </S.NavButton>
        </Show>
      </S.CarouselWrapper>

      <Show when={props.images.length > 1}>
        <S.DotsContainer>
          <For each={props.images}>
            {(_, i) => (
              <S.Dot
                theme={theme}
                $active={i() === currentIndex.value}
                onClick={() => goTo(i())}
                aria-label={`Go to image ${i() + 1}`}
              />
            )}
          </For>
        </S.DotsContainer>
      </Show>

      <Lightbox
        src={lightboxSrc.value}
        alt={lightboxAlt.value}
        isOpen={lightboxOpen.value}
        onClose={() => {
          lightboxOpen.value = false;
        }}
      />
    </>
  );
}
