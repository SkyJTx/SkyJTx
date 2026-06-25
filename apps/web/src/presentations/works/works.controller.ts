import { useSignal } from "@skyjt/signals-solid";
import { useSolidQuery } from "@skyjt/query-solid";
import { SOFTWARE_PROJECTS } from "~/constants/worksData";

export type WorksSegment = "software" | "music";

export function useWorksController() {
  const activeSegment = useSignal<WorksSegment>("software");

  const projectsQuery = useSolidQuery({
    queryKey: "projects",
    queryFn: async () => {
      return SOFTWARE_PROJECTS;
    },
    initialData: SOFTWARE_PROJECTS,
  });

  const handleOpenUrl = (url: string) => {
    try {
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to open URL", error);
    }
  };

  return {
    activeSegment,
    projectsQuery,
    handleOpenUrl,
  };
}

