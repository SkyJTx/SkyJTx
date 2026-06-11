export function useHomeController() {
  const handleScrollDown = () => {
    const target = document.getElementById("About");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    handleScrollDown,
  };
}
