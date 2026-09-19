import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useScrollspy } from "~/components/NavigationBar/useScrollspy";
import { NavigationProvider, useNavigation } from "~/components/NavigationBar/NavigationContext";

describe("useScrollspy and Navigation scroll locking", () => {
  let observedElements: Element[] = [];
  let observerCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
  let observerOptions: IntersectionObserverInit | undefined;
  let disconnectSpy = vi.fn();
  let scrollIntoViewSpy = vi.fn();

  beforeEach(() => {
    observedElements = [];
    disconnectSpy = vi.fn();
    scrollIntoViewSpy = vi.fn();

    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewSpy;

    class MockIntersectionObserver {
      constructor(
        callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
        options?: IntersectionObserverInit
      ) {
        observerCallback = callback;
        observerOptions = options;
      }
      observe(el: Element) {
        observedElements.push(el);
      }
      unobserve() {}
      disconnect() {
        disconnectSpy();
      }
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("configures observer with -15% 0px -40% 0px rootMargin and observes all sections", () => {
    const sections = ["Home", "About", "Works", "Contacts"];

    sections.forEach((id) => {
      const div = document.createElement("div");
      div.id = id;
      document.body.appendChild(div);
    });

    const TestComponent = () => {
      const nav = useNavigation();
      useScrollspy({ sections, nav });
      return <div>Config Test</div>;
    };

    render(() => (
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    ));

    expect(observerOptions?.rootMargin).toBe("-15% 0px -40% 0px");
    expect(observerOptions?.threshold).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(observedElements.map((el) => el.id)).toEqual(["Home", "About", "Works", "Contacts"]);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) document.body.removeChild(el);
    });
  });

  it("resolves dominant section when multiple sections intersect", async () => {
    const sections = ["Home", "About", "Works", "Contacts"];
    sections.forEach((id) => {
      const div = document.createElement("div");
      div.id = id;
      document.body.appendChild(div);
    });

    Object.defineProperty(window, "scrollY", { value: 500, configurable: true, writable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 3000, configurable: true, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true, writable: true });

    const TestComponent = () => {
      const nav = useNavigation();
      useScrollspy({ sections, nav });
      return <span data-testid="active">{nav.activeSection()}</span>;
    };

    const { getByTestId } = render(() => (
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    ));

    const aboutTarget = document.getElementById("About")!;
    const worksTarget = document.getElementById("Works")!;

    observerCallback([
      {
        target: aboutTarget,
        isIntersecting: true,
        intersectionRatio: 0.8,
        boundingClientRect: { top: 80 } as DOMRectReadOnly,
      },
      {
        target: worksTarget,
        isIntersecting: true,
        intersectionRatio: 0.2,
        boundingClientRect: { top: 600 } as DOMRectReadOnly,
      },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByTestId("active").textContent).toBe("About");

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) document.body.removeChild(el);
    });
  });

  it("suppresses observer section updates during programmatic smooth scrolling", async () => {
    const sections = ["Home", "About", "Works", "Contacts"];
    sections.forEach((id) => {
      const div = document.createElement("div");
      div.id = id;
      document.body.appendChild(div);
    });

    const TestComponent = () => {
      const nav = useNavigation();
      useScrollspy({ sections, nav });
      return (
        <div>
          <span data-testid="active">{nav.activeSection()}</span>
          <button type="button" onClick={() => nav.scrollToSection("About")}>
            LockScroll
          </button>
        </div>
      );
    };

    const { getByTestId, getByText } = render(() => (
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    ));

    await fireEvent.click(getByText("LockScroll"));
    expect(getByTestId("active").textContent).toBe("About");

    const worksTarget = document.getElementById("Works")!;

    observerCallback([
      {
        target: worksTarget,
        isIntersecting: true,
        intersectionRatio: 0.95,
        boundingClientRect: { top: 70 } as DOMRectReadOnly,
      },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByTestId("active").textContent).toBe("About");

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) document.body.removeChild(el);
    });
  });

  it("NavigationProvider provides programmatic scroll locking on scrollToSection", async () => {
    const TestComponent = () => {
      const nav = useNavigation();
      return (
        <div>
          <div id="About">About Content</div>
          <span data-testid="active">{nav.activeSection()}</span>
          <span data-testid="locking">{nav.isProgrammaticScroll() ? "locked" : "unlocked"}</span>
          <button type="button" onClick={() => nav.scrollToSection("About")}>
            Scroll
          </button>
        </div>
      );
    };

    const { getByTestId, getByText } = render(() => (
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    ));

    expect(getByTestId("active").textContent).toBe("Home");
    expect(getByTestId("locking").textContent).toBe("unlocked");

    await fireEvent.click(getByText("Scroll"));

    expect(getByTestId("active").textContent).toBe("About");
    expect(getByTestId("locking").textContent).toBe("locked");
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });
});
