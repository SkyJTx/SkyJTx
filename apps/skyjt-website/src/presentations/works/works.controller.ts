import { createMemo, createSignal } from "solid-js";
import { fetchWorksData } from "~/services";

export type WorksSegment = "software" | "music";

/**
 * Controller managing work projects data and segmented view state.
 */
export function useWorksController() {
  const [activeSegment, setActiveSegment] = createSignal<WorksSegment>("software");
  const projects = createMemo(() => fetchWorksData());

  return {
    activeSegment,
    setActiveSegment,
    get projects() {
      return projects();
    },
  };
}
