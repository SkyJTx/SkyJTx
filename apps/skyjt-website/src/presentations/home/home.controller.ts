import { createMemo } from "solid-js";
import { getPersonalInfoQuery } from "~/services";
import { NOT_FOUND_PERSONAL_INFO } from "~/constants";

export function useHomeController() {
  const personalInfo = createMemo(async () => {
    try {
      return await getPersonalInfoQuery();
    } catch {
      return NOT_FOUND_PERSONAL_INFO;
    }
  });

  const handleScrollDown = () => {
    const aboutEl = document.getElementById("About");
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return {
    get personalInfo() {
      return personalInfo() ?? NOT_FOUND_PERSONAL_INFO;
    },
    handleScrollDown,
  };
}
