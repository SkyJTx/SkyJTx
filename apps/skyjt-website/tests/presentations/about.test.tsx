import { render } from "@solidjs/testing-library";
import { createRoot } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { AboutPresentation, useParallax } from "~/presentations/about";

describe("About presentation & useParallax", () => {
  it("computes parallax offsets from target element geometry", () => {
    createRoot((dispose) => {
      const el = document.createElement("div");
      Object.defineProperty(el, "getBoundingClientRect", {
        value: () => ({
          top: 200,
          bottom: 600,
          height: 400,
          left: 0,
          right: 800,
          width: 800,
        }),
      });

      const parallax = useParallax(() => el, {
        bgSpeed: 50,
        avatarSpeed: -30,
        contentSpeed: -10,
      });

      expect(typeof parallax.bgOffset()).toBe("number");
      expect(typeof parallax.avatarOffset()).toBe("number");
      expect(typeof parallax.contentOffset()).toBe("number");
      expect(typeof parallax.progress()).toBe("number");

      dispose();
    });
  });

  it("yields zero offsets when prefers-reduced-motion is active", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    createRoot((dispose) => {
      const el = document.createElement("div");
      const parallax = useParallax(() => el);

      expect(parallax.bgOffset()).toBe(0);
      expect(parallax.avatarOffset()).toBe(0);
      expect(parallax.contentOffset()).toBe(0);
      expect(parallax.progress()).toBe(0);

      dispose();
    });

    window.matchMedia = originalMatchMedia;
  });

  it("renders AboutPresentation with open de-cardified structure and parallax layers", async () => {
    const { container, findByText } = render(() => <AboutPresentation />);
    await findByText("About Me");

    const section = container.querySelector("#About");
    expect(section).not.toBeNull();
    // Confirms no .card class is present
    expect(section?.querySelector(".card")).toBeNull();

    // Confirms parallax aura backdrop and layer transforms are present
    const aura = section?.querySelector(".bg-radial");
    expect(aura).not.toBeNull();

    const transformLayers = section?.querySelectorAll(".will-change-transform");
    expect(transformLayers?.length).toBeGreaterThanOrEqual(2);
  });
});
