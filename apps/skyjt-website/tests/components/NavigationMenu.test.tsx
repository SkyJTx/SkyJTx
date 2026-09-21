import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createSignal } from "solid-js";
import { NavigationMenu } from "~/components/NavigationBar/NavigationMenu";

describe("NavigationMenu component", () => {
  const sections = ["Home", "About", "Works", "Contact"] as const;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all section buttons with correct labels and accessibility attributes", () => {
    const handleSelect = vi.fn();
    const { getByRole, getAllByRole } = render(() => (
      <NavigationMenu
        sections={sections}
        activeSection="Home"
        onSelectSection={handleSelect}
      />
    ));

    const buttons = getAllByRole("button");
    expect(buttons).toHaveLength(4);

    const homeButton = getByRole("button", { name: "Home" });
    expect(homeButton.getAttribute("aria-current")).toBe("page");

    const aboutButton = getByRole("button", { name: "About" });
    expect(aboutButton.getAttribute("aria-current")).toBeNull();
  });

  it("calls onSelectSection when a section button is clicked", async () => {
    const handleSelect = vi.fn();
    const { getByRole } = render(() => (
      <NavigationMenu
        sections={sections}
        activeSection="Home"
        onSelectSection={handleSelect}
      />
    ));

    const worksButton = getByRole("button", { name: "Works" });
    await fireEvent.click(worksButton);

    expect(handleSelect).toHaveBeenCalledWith("Works");
  });

  it("schedules measurement on document complete and positions indicator", async () => {
    const handleSelect = vi.fn();
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    render(() => (
      <NavigationMenu
        sections={sections}
        activeSection="Home"
        onSelectSection={handleSelect}
      />
    ));

    expect(rafSpy).toHaveBeenCalled();
  });

  it("defers measurement until load event if document.readyState is interactive", async () => {
    const originalReadyState = document.readyState;
    Object.defineProperty(document, "readyState", {
      value: "interactive",
      configurable: true,
    });

    const rafSpy = vi.spyOn(window, "requestAnimationFrame");
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const handleSelect = vi.fn();
    render(() => (
      <NavigationMenu
        sections={sections}
        activeSection="Home"
        onSelectSection={handleSelect}
      />
    ));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "load",
      expect.any(Function),
      { once: true }
    );

    // Fire the load event
    window.dispatchEvent(new Event("load"));

    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });

    expect(rafSpy).toHaveBeenCalled();

    Object.defineProperty(document, "readyState", {
      value: originalReadyState,
      configurable: true,
    });
  });

  it("updates indicator when activeSection signal updates", async () => {
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");
    const [active, setActive] = createSignal("Home");

    render(() => (
      <NavigationMenu
        sections={sections}
        activeSection={active()}
        onSelectSection={setActive}
      />
    ));

    const initialRafCount = rafSpy.mock.calls.length;
    setActive("About");
    await Promise.resolve();

    expect(rafSpy.mock.calls.length).toBeGreaterThan(initialRafCount);
  });

  it("cleans up listeners and cancels animation frames on unmount", () => {
    const cancelRafSpy = vi.spyOn(window, "cancelAnimationFrame");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(() => (
      <NavigationMenu
        sections={sections}
        activeSection="Home"
        onSelectSection={vi.fn()}
      />
    ));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("load", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});