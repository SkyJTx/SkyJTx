import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { HomePresentation } from "~/presentations/home";
import { AboutPresentation } from "~/presentations/about";
import { WorksPresentation } from "~/presentations/works";
import { ContactsPresentation } from "~/presentations/contacts";

describe("Fullscreen and unclipped presentations", () => {
  it("HomePresentation has min-h-screen and min-h-dvh", () => {
    const { container } = render(() => <HomePresentation />);
    const section = container.querySelector("#Home");
    expect(section).not.toBeNull();
    expect(section?.classList.contains("min-h-screen")).toBe(true);
    expect(section?.classList.contains("min-h-dvh")).toBe(true);
  });

  it("AboutPresentation has min-h-screen, min-h-dvh, and unclipped layout", () => {
    const { container } = render(() => <AboutPresentation />);
    const section = container.querySelector("#About");
    expect(section).not.toBeNull();
    expect(section?.classList.contains("min-h-screen")).toBe(true);
    expect(section?.classList.contains("min-h-dvh")).toBe(true);

    const card = section?.querySelector(".card");
    expect(card?.classList.contains("overflow-visible")).toBe(true);

    const emailLink = section?.querySelector('a[href^="mailto:"]');
    expect(emailLink?.classList.contains("break-all")).toBe(true);
  });

  it("WorksPresentation has min-h-screen and min-h-dvh", () => {
    const { container } = render(() => <WorksPresentation />);
    const section = container.querySelector("#Works");
    expect(section).not.toBeNull();
    expect(section?.classList.contains("min-h-screen")).toBe(true);
    expect(section?.classList.contains("min-h-dvh")).toBe(true);
  });

  it("ContactsPresentation has min-h-screen and min-h-dvh", () => {
    const { container } = render(() => <ContactsPresentation />);
    const section = container.querySelector("#Contacts");
    expect(section).not.toBeNull();
    expect(section?.classList.contains("min-h-screen")).toBe(true);
    expect(section?.classList.contains("min-h-dvh")).toBe(true);
  });
});
