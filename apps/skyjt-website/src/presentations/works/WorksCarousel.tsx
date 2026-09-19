import type { JSX } from "@solidjs/web";
import { Carousel } from "~/components/Carousel";
import type { ProjectData } from "~/constants/worksData";
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
    <Carousel
      items={props.projects}
      renderItem={(project) => <ProjectCard project={project} />}
      slidesPerViewMobile={1}
      slidesPerViewDesktop={2}
    />
  );
}
