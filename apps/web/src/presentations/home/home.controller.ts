import { PERSONAL_INFO } from "~/constants/personalInfo";

export function useHomeController() {
  const handleScrollDown = () => {
    const target = document.getElementById("About");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    handleScrollDown,
    personalInfo: PERSONAL_INFO,
  };
}
