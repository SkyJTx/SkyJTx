import { createMemo } from "solid-js";
import { getPersonalInfoQuery } from "~/services";
import { NOT_FOUND_PERSONAL_INFO } from "~/constants";

export function useAboutController() {
  const personalInfo = createMemo(async () => {
    try {
      return await getPersonalInfoQuery();
    } catch {
      return NOT_FOUND_PERSONAL_INFO;
    }
  });

  return {
    get fullName() {
      return personalInfo()?.fullName ?? NOT_FOUND_PERSONAL_INFO.fullName;
    },
    get avatarUrl() {
      return personalInfo()?.myselfPhotoUrl ?? NOT_FOUND_PERSONAL_INFO.myselfPhotoUrl;
    },
    get resumeUrl() {
      return personalInfo()?.resumeUrl ?? NOT_FOUND_PERSONAL_INFO.resumeUrl;
    },
    get location() {
      return personalInfo()?.location ?? NOT_FOUND_PERSONAL_INFO.location;
    },
    get email() {
      return personalInfo()?.email ?? NOT_FOUND_PERSONAL_INFO.email;
    },
    get phone() {
      return personalInfo()?.phone ?? NOT_FOUND_PERSONAL_INFO.phone;
    },
  };
}
