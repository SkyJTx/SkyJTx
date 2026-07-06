import { Carousel } from "~/components/Carousel";
import type { ProjectData } from "~/constants/worksData";
import { ProjectCard } from "./ProjectCard";

export interface WorksCarouselProps {
  projects: ProjectData[];
}

/**
 * Horizontal carousel of ProjectCards.
 */
export function WorksCarousel(props: WorksCarouselProps) {
  return (
    <Carousel
      items={props.projects}
      renderItem={(project) => <ProjectCard project={project} />}
      slidesPerViewMobile={1}
      slidesPerViewDesktop={2}
    />
  );
}
