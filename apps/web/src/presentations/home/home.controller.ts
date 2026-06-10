import { useComputed } from "@skyjt/signals-solid";
import { useThemeController } from "~/components/ThemeComponents";
import { useNavigationRepo } from "~/components/NavigationBar";

export function useHomeController() {
  const controller = useThemeController();
  const repo = useNavigationRepo<string>();

  const logoSrc = useComputed(() => {
    const r = controller.resolvedTheme();
    if (r === "dark") {
      return "/icon-dark.svg";
    }
    return "/icon-light.svg";
  });

  const handleExploreProjects = () => {
    try {
      repo.setActiveMenu("Works");
    } catch (error) {
      console.error("Navigation error", error);
    }
  };

  const handleContactMe = () => {
    try {
      repo.setActiveMenu("Contacts");
    } catch (error) {
      console.error("Navigation error", error);
    }
  };

  const handleScrollDown = () => {
    const focusSection = document.getElementById("focus-section");
    if (focusSection) {
      focusSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    logoSrc,
    handleExploreProjects,
    handleContactMe,
    handleScrollDown,
  };
}
