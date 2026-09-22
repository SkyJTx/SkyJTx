import { render } from "@solidjs/testing-library";
import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
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

      expect(el.style.getPropertyValue("--parallax-bg")).toContain("px");
      expect(el.style.getPropertyValue("--parallax-avatar")).toContain("px");
      expect(el.style.getPropertyValue("--parallax-content")).toContain("px");

      dispose();
    });
  });

  it("updates cursor light coordinates independently without tilt when enableTilt is false", () => {
    createRoot((dispose) => {
      const el = document.createElement("div");
      Object.defineProperty(el, "getBoundingClientRect", {
        value: () => ({
          top: 100,
          bottom: 500,
          height: 400,
          left: 100,
          right: 900,
          width: 800,
        }),
      });

      const parallax = useParallax(() => el, {
        enableTilt: false,
        enableCursorLight: true,
      });

      expect(parallax.tiltX()).toBe(0);
      expect(parallax.tiltY()).toBe(0);

      const EventCtor = typeof window.PointerEvent !== "undefined" ? window.PointerEvent : MouseEvent;
      const pointerEvent = new EventCtor("pointermove", {
        clientX: 700,
        clientY: 200,
        bubbles: true,
      });
      el.dispatchEvent(pointerEvent);

      // Tilt remains 0deg
      expect(parallax.tiltX()).toBe(0);
      expect(parallax.tiltY()).toBe(0);
      expect(el.style.getPropertyValue("--tilt-x")).toBe("0deg");
      expect(el.style.getPropertyValue("--tilt-y")).toBe("0deg");

      // Cursor light updates
      expect(el.style.getPropertyValue("--mouse-x")).toBe("75%");
      expect(el.style.getPropertyValue("--mouse-y")).toBe("25%");
      expect(el.style.getPropertyValue("--cursor-light-opacity")).toBe("1");

      const leaveEvent = new EventCtor("pointerleave", { bubbles: true });
      el.dispatchEvent(leaveEvent);

      // Light fades out while retaining exit coordinates (no center jump)
      expect(el.style.getPropertyValue("--cursor-light-opacity")).toBe("0");
      expect(el.style.getPropertyValue("--mouse-x")).toBe("75%");
      expect(el.style.getPropertyValue("--mouse-y")).toBe("25%");

      // Re-entering updates coordinates and reveals light
      const pointerEvent2 = new EventCtor("pointermove", {
        clientX: 300,
        clientY: 300,
        bubbles: true,
      });
      el.dispatchEvent(pointerEvent2);
      expect(el.style.getPropertyValue("--cursor-light-opacity")).toBe("1");
      expect(el.style.getPropertyValue("--mouse-x")).toBe("25%");
      expect(el.style.getPropertyValue("--mouse-y")).toBe("50%");

      // Scroll preserves active cursor light coordinates and opacity (no scroll strobe)
      window.dispatchEvent(new Event("scroll"));
      expect(el.style.getPropertyValue("--cursor-light-opacity")).toBe("1");
      expect(el.style.getPropertyValue("--mouse-x")).toBe("25%");
      expect(el.style.getPropertyValue("--mouse-y")).toBe("50%");

      dispose();
    });
  });

  it("calculates 3D tilt angles when enableTilt is true", () => {
    createRoot((dispose) => {
      const el = document.createElement("div");
      Object.defineProperty(el, "getBoundingClientRect", {
        value: () => ({
          top: 100,
          bottom: 500,
          height: 400,
          left: 100,
          right: 900,
          width: 800,
        }),
      });

      const parallax = useParallax(() => el, {
        maxTilt: 15,
        enableTilt: true,
      });

      const EventCtor = typeof window.PointerEvent !== "undefined" ? window.PointerEvent : MouseEvent;
      const pointerEvent = new EventCtor("pointermove", {
        clientX: 700,
        clientY: 200,
        bubbles: true,
      });
      el.dispatchEvent(pointerEvent);

      expect(parallax.tiltX()).toBe(7.5);
      expect(parallax.tiltY()).toBe(7.5);
      expect(el.style.getPropertyValue("--tilt-x")).toBe("7.5deg");
      expect(el.style.getPropertyValue("--tilt-y")).toBe("7.5deg");

      dispose();
    });
  });

  it("renders AboutPresentation with open structure, full name under avatar, and parallax layers", async () => {
    const { container, findByText } = render(() => <AboutPresentation />);
    await findByText("About Me");

    const section = container.querySelector("#About");
    expect(section).not.toBeNull();
    expect(section?.querySelector(".card")).toBeNull();

    const nameHeading = section?.querySelector("h3");
    expect(nameHeading).not.toBeNull();
    expect(nameHeading?.textContent?.trim().length).toBeGreaterThan(0);

    const aura = section?.querySelector(".bg-radial");
    expect(aura).not.toBeNull();

    const transformLayers = section?.querySelectorAll(".will-change-transform");
    expect(transformLayers?.length).toBeGreaterThanOrEqual(2);
  });
});
