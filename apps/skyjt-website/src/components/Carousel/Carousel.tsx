import type { JSX } from "@solidjs/web";
import {
  createSignal,
  createMemo,
  onSettled,
  For,
} from "solid-js";
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
 * Accessible responsive carousel component with swipe gesture tracking and navigation controls.
 */
export function Carousel<T>(props: CarouselProps<T>): JSX.Element {
  const [currentPage, setCurrentPage] = createSignal(0);
  const mobileSlides = () => props.slidesPerViewMobile ?? 1;
  const desktopSlides = () => props.slidesPerViewDesktop ?? 2;
  const [slidesPerView, setSlidesPerView] = createSignal(mobileSlides());

  const [isDragging, setIsDragging] = createSignal(false);
  const [startX, setStartX] = createSignal(0);
  const [dragOffset, setDragOffset] = createSignal(0);
  let viewportRef: HTMLDivElement | null = null;

  onSettled(() => {
    const update = () => {
      setSlidesPerView(window.innerWidth >= 768 ? desktopSlides() : mobileSlides());
    };
    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  });

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(props.items.length / slidesPerView()))
  );

  const slideWidthPercent = createMemo(() => 100 / slidesPerView());

  const goTo = (page: number) => {
    const max = totalPages() - 1;
    setCurrentPage(Math.max(0, Math.min(page, max)));
  };

  const dragOffsetPercent = createMemo(() => {
    if (!viewportRef) return 0;
    const width = viewportRef.getBoundingClientRect().width;
    if (width === 0) return 0;
    return (dragOffset() / width) * 100;
  });

  const trackOffset = createMemo(() => {
    return -(currentPage() * slidesPerView() * slideWidthPercent()) + dragOffsetPercent();
  });

  const handlePointerDown = (e: PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging()) return;
    setDragOffset(e.clientX - startX());
  };

  const handlePointerUp = () => {
    if (!isDragging()) return;
    setIsDragging(false);
    const threshold = 40;
    if (dragOffset() < -threshold) {
      goTo(currentPage() + 1);
    } else if (dragOffset() > threshold) {
      goTo(currentPage() - 1);
    }
    setDragOffset(0);
  };

  return (
    <div class="w-full flex flex-col gap-6 select-none">
      <div
        ref={(el) => {
          viewportRef = el;
        }}
        class="w-full overflow-hidden relative cursor-grab active:cursor-grabbing rounded-box"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          class="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${trackOffset()}%)`,
            "transition-duration": isDragging() ? "0ms" : "350ms",
          }}
        >
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
