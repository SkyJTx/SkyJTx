import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { Carousel } from "~/components/Carousel";
import { Card } from "~/components/Card";
import type { ProjectData } from "~/types";
import { ProjectCard } from "./ProjectCard";

/**
 * Properties for WorksCarousel component.
 */
export interface WorksCarouselProps {
  projects: readonly ProjectData[];
}

/**
 * Horizontal responsive carousel displaying portfolio project cards.
 */
export function WorksCarousel(props: WorksCarouselProps): JSX.Element {
  return (
    <Show
      when={props.projects.length > 0}
      fallback={
        <div class="max-w-lg mx-auto w-full">
          <Card
            title="No Projects Found"
            description="Projects are currently being loaded or updated."
          />
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

