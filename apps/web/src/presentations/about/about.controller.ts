import { useComputed } from "@skyjt/signals-solid";
import { useThemeController } from "~/components/ThemeComponents";
import { PERSONAL_INFO } from "~/constants/personalInfo";

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
    avatarUrl: PERSONAL_INFO.myselfPhotoUrl,
    location: PERSONAL_INFO.location,
    email: PERSONAL_INFO.email,
    phone: PERSONAL_INFO.phone,
    resumeUrl: PERSONAL_INFO.resumeUrl,
  };
}
