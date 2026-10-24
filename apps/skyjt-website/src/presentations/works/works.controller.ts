import { createMemo, createSignal } from "solid-js";
import { getWorksDataQuery, getMusicWorksDataQuery } from "~/services";
import { NOT_FOUND_PROJECTS, NOT_FOUND_MUSIC_WORKS } from "~/constants";
import * as v from "valibot";

export const WORKS_SEGMENTS = ["software", "music"] as const;
export const WorksSegmentSchema = v.picklist(WORKS_SEGMENTS);
export type WorksSegment = v.InferOutput<typeof WorksSegmentSchema>;

export function useWorksController() {
  const [activeSegment, setActiveSegment] = createSignal<WorksSegment>("software");
  const projects = createMemo(async () => {
    try {
      return await getWorksDataQuery();
    } catch {
      return NOT_FOUND_PROJECTS;
    }
  });
  const musicWorks = createMemo(async () => {
    try {
      return await getMusicWorksDataQuery();
    } catch {
      return NOT_FOUND_MUSIC_WORKS;
    }
  });

  return {
    activeSegment,
    setActiveSegment,
    get projects() {
      return projects() ?? NOT_FOUND_PROJECTS;
    },
    get musicWorks() {
      return musicWorks() ?? NOT_FOUND_MUSIC_WORKS;
    },
  };
}
