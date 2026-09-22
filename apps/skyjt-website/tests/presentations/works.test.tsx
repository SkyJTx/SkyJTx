import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { WorksPresentation } from "~/presentations/works";
import { WorksCarousel } from "~/presentations/works/WorksCarousel";
import type { ProjectData } from "~/types";

const sampleProjects: ProjectData[] = [
  {
    id: "clean-food-good-router",
    title: "Clean Food Good Router",
    description:
      "Clean food good router is the intelligence layer for the multi-model AI era. Instead of sending every request to one expensive model, it analyzes each user need and routes it to the best-fit AI engine based on speciality for quality, speed, and cost. This gives better overall answers, lower inference spend, and stronger governance through controlled model access. It also reduces vendor lock-in, letting teams adapt as providers and pricing change. In short, it turns fragmented AI usage into a scalable, policy-driven, ROI-focused system that improves product performance while protecting margins.",
    thumbnailUrl: "https://example.com/cfgr-thumb.jpg",
    images: [],
    links: [],
  },
  {
    id: "ruammitr",
    title: "RuamMitr",
    description: "A Super App developed in Flutter/Express.js.",
    thumbnailUrl: "https://example.com/ruammitr.jpg",
    images: [],
    links: [],
  },
];

describe("WorksPresentation", () => {
  it("switches tabs between software and music with default state", async () => {
    const { getByRole, getByText, findByText, queryByText } = render(() => <WorksPresentation />);

    expect(await findByText("Software Development")).toBeDefined();
    expect(getByText("Music")).toBeDefined();

    const hasLoadedProjects = queryByText("Clean Food Good Router") !== null;
    if (hasLoadedProjects) {
      expect(getByText("Clean Food Good Router")).toBeDefined();
    } else {
      expect(getByText("No Projects Found")).toBeDefined();
    }

    const musicTab = getByRole("tab", { name: "Music" });
    await fireEvent.click(musicTab);

    expect(
      getByText(
        "Music compositions and arrangements are being prepared. Check back soon for updates."
      )
    ).toBeDefined();
  });

  it("renders unboxed empty state in WorksCarousel when projects array is empty", () => {
    const { getByText } = render(() => <WorksCarousel projects={[]} />);
    expect(getByText("No Projects Found")).toBeDefined();
    expect(
      getByText("Projects are currently being loaded or updated.")
    ).toBeDefined();
  });

  it("truncates long work description with Show more toggle in WorksCarousel", async () => {
    const { getByRole, getByText, queryByText } = render(() => (
      <WorksCarousel projects={sampleProjects} />
    ));

    expect(getByText("Clean Food Good Router")).toBeDefined();
    expect(getByText("RuamMitr")).toBeDefined();

    const moreButton = getByRole("button", { name: /show more/i });
    expect(moreButton).toBeDefined();
    expect(moreButton.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(moreButton);
    expect(
      getByText(/In short, it turns fragmented AI usage into a scalable/i)
    ).toBeDefined();

    const lessButton = getByRole("button", { name: /show less/i });
    expect(lessButton).toBeDefined();
    expect(lessButton.getAttribute("aria-expanded")).toBe("true");

    await fireEvent.click(lessButton);
    expect(
      queryByText(/In short, it turns fragmented AI usage into a scalable/i)
    ).toBeNull();
  });
});
