import { createMemo } from "solid-js";
import { getContactDataQuery } from "~/services/portfolio";
import { NOT_FOUND_CONTACT_DATA } from "~/constants";
import { useClipboard } from "~/hooks/useClipboard";

/**
 * Controller managing contacts presentation view state.
 */
export function useContactsController() {
  const { copied, copy } = useClipboard(2000);
  const contactData = createMemo(async () => {
    try {
      return await getContactDataQuery();
    } catch {
      return NOT_FOUND_CONTACT_DATA;
    }
  });

  const handleCopyEmail = async () => {
    const email = contactData()?.contact?.email;
    if (!email) return;
    await copy(email);
  };

  return {
    get contact() {
      return contactData()?.contact ?? NOT_FOUND_CONTACT_DATA.contact;
    },
    get socialMedia() {
      return contactData()?.socialMedia ?? NOT_FOUND_CONTACT_DATA.socialMedia;
    },
    get workMedia() {
      return contactData()?.workMedia ?? NOT_FOUND_CONTACT_DATA.workMedia;
    },
    copied,
    handleCopyEmail,
  };
}
