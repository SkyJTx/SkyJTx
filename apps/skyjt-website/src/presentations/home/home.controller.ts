import { createMemo } from "solid-js";
import { getPersonalInfoQuery } from "~/services";

/**
 * Controller hook providing data and interactions for the home presentation.
 */
export function useHomeController() {
  const personalInfo = createMemo(() => getPersonalInfoQuery());

  const handleScrollDown = () => {
    const aboutEl = document.getElementById("About");
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return {
    get personalInfo() {
      return personalInfo();
    },
    handleScrollDown,
  };
}
