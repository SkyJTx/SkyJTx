export function useContactsController() {
  const handleSendEmail = () => {
    try {
      window.open("mailto:nattakarn.khumsupha.user1@outlook.com");
    } catch (error) {
      console.error("Failed to open mail client", error);
    }
  };

  return {
    handleSendEmail,
  };
}
