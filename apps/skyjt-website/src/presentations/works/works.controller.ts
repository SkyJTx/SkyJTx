import { createMemo, createSignal } from "solid-js";
import { getWorksDataQuery, getMusicWorksDataQuery } from "~/services";

export type WorksSegment = "software" | "music";

/**
 * Controller managing work projects data, music scores, and segmented view state.
 */
export function useWorksController() {
  const [activeSegment, setActiveSegment] = createSignal<WorksSegment>("software");
  const projects = createMemo(() => getWorksDataQuery());
  const musicWorks = createMemo(() => getMusicWorksDataQuery());

  return {
    activeSegment,
    setActiveSegment,
    get projects() {
      return projects();
    },
    get musicWorks() {
      return musicWorks();
    },
  };
}
