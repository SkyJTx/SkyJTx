import { createSignal } from "solid-js";
import { SOFTWARE_PROJECTS } from "~/constants/worksData";

export type WorksSegment = "software" | "music";

/**
 * Controller managing work projects data and segmented view state.
 */
export function useWorksController() {
  const [activeSegment, setActiveSegment] = createSignal<WorksSegment>("software");

  return {
    activeSegment,
    setActiveSegment,
    projects: SOFTWARE_PROJECTS,
  };
}
