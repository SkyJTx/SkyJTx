import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { Carousel } from "~/components/Carousel";
import { Icon } from "~/components/Icon";
import type { ProjectData } from "~/types";
import { ProjectCard } from "./ProjectCard";

/**
 * Properties for WorksCarousel component.
 */
export interface WorksCarouselProps {
  readonly projects: readonly ProjectData[];
}

/**
 * Horizontal responsive carousel displaying portfolio project cards.
 */
export function WorksCarousel(props: WorksCarouselProps): JSX.Element {
  return (
    <Show
      when={props.projects.length > 0}
      fallback={
        <div class="max-w-lg mx-auto w-full p-8 rounded-2xl border border-dashed border-base-300/80 bg-base-200/20 backdrop-blur-xs flex flex-col items-center gap-3 text-center">
          <div class="p-3.5 rounded-full bg-base-300/50 text-base-content/60">
            <Icon name="file-text" size={24} />
          </div>
          <h3 class="text-lg font-bold text-base-content tracking-tight">No Projects Found</h3>
          <p class="text-sm text-base-content/70 leading-relaxed">
            Projects are currently being loaded or updated.
          </p>
        </div>
      }
    >
      <Carousel
        items={props.projects}
        renderItem={(project) => <ProjectCard project={project} />}
        slidesPerViewMobile={1}
        slidesPerViewDesktop={2}
      />
    </Show>
  );
}
