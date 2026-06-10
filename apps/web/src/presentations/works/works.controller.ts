export function useWorksController() {
  const handleOpenUrl = (url: string) => {
    try {
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to open URL", error);
    }
  };

  return {
    handleOpenUrl,
  };
}
