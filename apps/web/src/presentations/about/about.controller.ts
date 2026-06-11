import { useComputed } from "@skyjt/signals-solid";
import { useThemeController } from "~/components/ThemeComponents";

export function useAboutController() {
  const controller = useThemeController();

  const logoSrc = useComputed(() => {
    const r = controller.resolvedTheme();
    if (r === "dark") {
      return "/icon-dark.svg";
    }
    return "/icon-light.svg";
  });

  return {
    logoSrc,
  };
}
