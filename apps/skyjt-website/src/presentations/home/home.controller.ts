import { PERSONAL_INFO } from "~/constants/personalInfo";

/**
 * Controller hook providing data and interactions for the home presentation.
 */
export function useHomeController() {
  const handleScrollDown = () => {
    const aboutEl = document.getElementById("About");
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return {
    personalInfo: PERSONAL_INFO,
    handleScrollDown,
  };
}
