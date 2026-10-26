import type { JSX } from "@solidjs/web";
import {
  createSignal,
  createMemo,
  onSettled,
  For,
} from "solid-js";
import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";
import { Icon } from "~/components/Icon";

/**
 * Properties for generic responsive Carousel component.
 */
export interface CarouselProps<T> {
  items: readonly T[];
  renderItem: (item: T) => JSX.Element;
  slidesPerViewMobile?: number;
  slidesPerViewDesktop?: number;
}

/**
 * Accessible responsive carousel component powered by embla-carousel physics engine.
 */
export function Carousel<T>(props: CarouselProps<T>): JSX.Element {
  const [currentPage, setCurrentPage] = createSignal(0);
  const [scrollSnaps, setScrollSnaps] = createSignal<number[]>([]);
  const mobileSlides = () => props.slidesPerViewMobile ?? 1;
  const desktopSlides = () => props.slidesPerViewDesktop ?? 2;
  const [slidesPerView, setSlidesPerView] = createSignal(mobileSlides());

  let viewportRef: HTMLDivElement | null = null;
  let emblaApi: EmblaCarouselType | undefined;

  const totalPages = createMemo(() => {
    const snaps = scrollSnaps();
    if (snaps.length > 0) return snaps.length;
    return Math.max(1, Math.ceil(props.items.length / slidesPerView()));
  });

  const slideWidthPercent = createMemo(() => 100 / slidesPerView());

  onSettled(() => {
    if (
      typeof window === "undefined" ||
      !viewportRef ||
      typeof IntersectionObserver === "undefined" ||
      typeof ResizeObserver === "undefined"
    ) return;

    const currentWidth = window.innerWidth || 1024;
    const initialView = currentWidth >= 768 ? desktopSlides() : mobileSlides();
    if (initialView !== slidesPerView()) {
      setSlidesPerView(initialView);
    }

    try {
      emblaApi = EmblaCarousel(viewportRef, {
        loop: false,
        align: "start",
        containScroll: "trimSnaps",
        slidesToScroll: initialView,
      });

      const syncState = () => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        setCurrentPage(emblaApi.selectedScrollSnap());
      };

      emblaApi.on("select", syncState);
      emblaApi.on("reInit", syncState);
      syncState();
    } catch (err) {
      console.error("[Carousel] Failed to initialize Embla Carousel:", err);
    }

    const handleResize = () => {
      const nextView = window.innerWidth >= 768 ? desktopSlides() : mobileSlides();
      if (nextView !== slidesPerView()) {
        setSlidesPerView(nextView);
        emblaApi?.reInit({
          slidesToScroll: nextView,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      emblaApi?.destroy();
    };
  });

  const goTo = (page: number) => {
    const max = totalPages() - 1;
    const target = Math.max(0, Math.min(page, max));
    setCurrentPage(target);
    emblaApi?.scrollTo(target);
  };

  return (
    <div class="w-full flex flex-col gap-6 select-none">
      <div
        ref={(el) => {
          viewportRef = el;
        }}
        class="w-full overflow-hidden relative cursor-grab active:cursor-grabbing rounded-box"
      >
        <div class="flex">
          <For each={props.items}>
            {(item) => (
              <div
                class="shrink-0 p-3 box-border"
                style={{ width: `${slideWidthPercent()}%` }}
              >
                {props.renderItem(item)}
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4">
        <button
          type="button"
          class="btn btn-circle btn-sm btn-ghost border border-base-300 hover:bg-base-300 disabled:opacity-30"
          disabled={currentPage() === 0}
          onClick={() => goTo(currentPage() - 1)}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" size={16} />
        </button>

        <div class="flex items-center gap-2">
          <For each={Array.from({ length: totalPages() })}>
            {(_, index) => (
              <button
                type="button"
                class={[
                  "h-2 rounded-full transition-all duration-300",
                  index() === currentPage() ? "w-6 bg-primary" : "w-2 bg-base-300 hover:bg-base-content/40",
                ]}
                onClick={() => goTo(index())}
                aria-label={`Go to page ${index() + 1}`}
              />
            )}
          </For>
        </div>

        <button
          type="button"
          class="btn btn-circle btn-sm btn-ghost border border-base-300 hover:bg-base-300 disabled:opacity-30"
          disabled={currentPage() >= totalPages() - 1}
          onClick={() => goTo(currentPage() + 1)}
          aria-label="Next page"
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}
