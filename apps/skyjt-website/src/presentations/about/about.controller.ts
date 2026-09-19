import { PERSONAL_INFO } from "~/constants/personalInfo";

/**
 * Controller hook providing data and actions for the about presentation.
 */
export function useAboutController() {
  return {
    fullName: PERSONAL_INFO.fullName,
    avatarUrl: PERSONAL_INFO.myselfPhotoUrl,
    resumeUrl: PERSONAL_INFO.resumeUrl,
    location: PERSONAL_INFO.location,
    email: PERSONAL_INFO.email,
    phone: PERSONAL_INFO.phone,
  };
}
