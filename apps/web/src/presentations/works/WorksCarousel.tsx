import { For, onMount, onCleanup } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useSignal, useComputed } from "@skyjt/signals-solid";
import { Icon } from "~/components/Icon";
import type { ProjectData } from "~/constants/worksData";
import { ProjectCard } from "./ProjectCard";
import * as S from "./WorksCarousel.styles";

export interface WorksCarouselProps {
  projects: ProjectData[];
}

/**
 * Horizontal carousel of ProjectCards with responsive slide widths and navigation.
 */
export function WorksCarousel(props: WorksCarouselProps) {
  const theme = useTheme();
  const currentPage = useSignal(0);

  const slidesPerView = useSignal(1);

  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const dragOffset = useSignal(0);
  let viewportRef: HTMLDivElement | undefined;
  let wasDragging = false;

  onMount(() => {
    const update = () => {
      slidesPerView.value = window.innerWidth >= 768 ? 2 : 1;
    };
    update();
    window.addEventListener("resize", update);

    if (viewportRef) {
      viewportRef.addEventListener("touchstart", handleTouchStart, { passive: true });
      viewportRef.addEventListener("touchmove", handleTouchMove, { passive: true });
      viewportRef.addEventListener("touchend", handleTouchEnd);
      viewportRef.addEventListener("mousedown", handleMouseDown);
      viewportRef.addEventListener("click", handleCaptureClick, { capture: true });
    }

    onCleanup(() => {
      window.removeEventListener("resize", update);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (viewportRef) {
        viewportRef.removeEventListener("touchstart", handleTouchStart);
        viewportRef.removeEventListener("touchmove", handleTouchMove);
        viewportRef.removeEventListener("touchend", handleTouchEnd);
        viewportRef.removeEventListener("mousedown", handleMouseDown);
        viewportRef.removeEventListener("click", handleCaptureClick, { capture: true });
      }
    });
  });

  const totalPages = useComputed(() =>
    Math.ceil(props.projects.length / slidesPerView.value),
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

  const handleTouchStart = (e: TouchEvent) => {
    isDragging.value = true;
    startX.value = e.touches[0].clientX;
    dragOffset.value = 0;
    wasDragging = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;
    const currentX = e.touches[0].clientX;
    dragOffset.value = currentX - startX.value;
  };

  const handleTouchEnd = () => {
    if (!isDragging.value) return;
    isDragging.value = false;

    const threshold = 50;
    if (dragOffset.value < -threshold) {
      goTo(currentPage.value + 1);
    } else if (dragOffset.value > threshold) {
      goTo(currentPage.value - 1);
    }
    dragOffset.value = 0;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    const diff = e.clientX - startX.value;
    dragOffset.value = diff;
    if (Math.abs(diff) > 10) {
      wasDragging = true;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.value) return;
    isDragging.value = false;

    const threshold = 50;
    if (dragOffset.value < -threshold) {
      goTo(currentPage.value + 1);
    } else if (dragOffset.value > threshold) {
      goTo(currentPage.value - 1);
    }
    dragOffset.value = 0;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.value = true;
    startX.value = e.clientX;
    dragOffset.value = 0;
    wasDragging = false;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleCaptureClick = (e: MouseEvent) => {
    if (wasDragging) {
      e.preventDefault();
      e.stopPropagation();
      wasDragging = false;
    }
  };



  return (
    <>
      <S.CarouselViewport ref={viewportRef}>
        <S.CarouselTrack $offset={trackOffset()} $isDragging={isDragging.value}>
          <For each={props.projects}>
            {(project) => (
              <S.CarouselSlide>
                <ProjectCard project={project} />
              </S.CarouselSlide>
            )}
          </For>
        </S.CarouselTrack>
      </S.CarouselViewport>

      <S.NavRow>
        <S.NavButton
          theme={theme}
          disabled={currentPage.value === 0}
          onClick={() => goTo(currentPage.value - 1)}
          aria-label="Previous projects"
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
          aria-label="Next projects"
        >
          <Icon name="chevron-right" size={18} />
        </S.NavButton>
      </S.NavRow>
    </>
  );
}
