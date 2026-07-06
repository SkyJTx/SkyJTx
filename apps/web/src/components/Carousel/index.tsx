import { For, onMount, onCleanup, JSX } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useSignal, useComputed } from "@skyjt/signals-solid";
import { Icon } from "~/components/Icon";
import { GestureDetector, HitTestBehavior } from "~/components/GestureDetector";
import * as S from "./styles";

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  slidesPerViewMobile?: number;
  slidesPerViewDesktop?: number;
}

/**
 * Horizontal generic carousel with responsive slide widths and navigation.
 */
export function Carousel<T>(props: CarouselProps<T>) {
  const theme = useTheme();
  const currentPage = useSignal(0);

  const mobileSlides = props.slidesPerViewMobile || 1;
  const desktopSlides = props.slidesPerViewDesktop || 2;
  const slidesPerView = useSignal(mobileSlides);

  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const dragOffset = useSignal(0);
  let viewportRef: HTMLDivElement | undefined;

  onMount(() => {
    const update = () => {
      slidesPerView.value = window.innerWidth >= 768 ? desktopSlides : mobileSlides;
    };
    update();
    window.addEventListener("resize", update);

    onCleanup(() => {
      window.removeEventListener("resize", update);
    });
  });

  const totalPages = useComputed(() =>
    Math.ceil(props.items.length / slidesPerView.value),
  );

  const slideWidth = useComputed(() => (100 / slidesPerView.value));

  const goTo = (page: number) => {
    const max = totalPages() - 1;
    currentPage.value = Math.max(0, Math.min(page, max));
  };

  const dragOffsetPercent = useComputed(() => {
    if (!viewportRef) return 0;
    const width = viewportRef.getBoundingClientRect().width;
    if (width === 0) return 0;
    return (dragOffset.value / width) * 100;
  });

  const trackOffset = useComputed(
    () => -(currentPage.value * slidesPerView() * slideWidth()) + dragOffsetPercent(),
  );

  return (
    <>
      <GestureDetector
        behavior={HitTestBehavior.opaque}
        onHorizontalDragStart={(details) => {
          isDragging.value = true;
          startX.value = details.globalPosition.dx;
          dragOffset.value = 0;
        }}
        onHorizontalDragUpdate={(details) => {
          if (!isDragging.value) return;
          dragOffset.value = details.globalPosition.dx - startX.value;
        }}
        onHorizontalDragEnd={() => {
          if (!isDragging.value) return;
          isDragging.value = false;
          const threshold = 50;
          if (dragOffset.value < -threshold) {
            goTo(currentPage.value + 1);
          } else if (dragOffset.value > threshold) {
            goTo(currentPage.value - 1);
          }
          dragOffset.value = 0;
        }}
        onHorizontalDragCancel={() => {
          isDragging.value = false;
          dragOffset.value = 0;
        }}
      >
        <S.CarouselViewport ref={viewportRef}>
          <S.CarouselTrack $offset={trackOffset()} $isDragging={isDragging.value}>
            <For each={props.items}>
              {(item) => (
                <S.CarouselSlide $width={slideWidth()}>
                  {props.renderItem(item as T)}
                </S.CarouselSlide>
              )}
            </For>
          </S.CarouselTrack>
        </S.CarouselViewport>
      </GestureDetector>

      <S.NavRow>
        <S.NavButton
          theme={theme}
          disabled={currentPage.value === 0}
          onClick={() => goTo(currentPage.value - 1)}
          aria-label="Previous items"
        >
          <Icon name="chevron-left" size={18} />
        </S.NavButton>

        <S.DotsContainer>
          <For each={Array.from({ length: totalPages() })}>
            {(_, i) => (
              <S.Dot
                theme={theme}
                $active={i() === currentPage.value}
                onClick={() => goTo(i())}
                aria-label={`Go to page ${i() + 1}`}
              />
            )}
          </For>
        </S.DotsContainer>

        <S.NavButton
          theme={theme}
          disabled={currentPage.value >= totalPages() - 1}
          onClick={() => goTo(currentPage.value + 1)}
          aria-label="Next items"
        >
          <Icon name="chevron-right" size={18} />
        </S.NavButton>
      </S.NavRow>
    </>
  );
}
