import { createMemo } from "solid-js";
import { getPersonalInfoQuery } from "~/services";

/**
 * Controller hook providing data and actions for the about presentation.
 */
export function useAboutController() {
  const personalInfo = createMemo(() => getPersonalInfoQuery());

  return {
    get fullName() {
      return personalInfo().fullName;
    },
    get avatarUrl() {
      return personalInfo().myselfPhotoUrl;
    },
    get resumeUrl() {
      return personalInfo().resumeUrl;
    },
    get location() {
      return personalInfo().location;
    },
    get email() {
      return personalInfo().email;
    },
    get phone() {
      return personalInfo().phone;
    },
  };
}
