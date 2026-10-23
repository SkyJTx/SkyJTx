import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { WorksPresentation } from "~/presentations/works";
import { WorksCarousel } from "~/presentations/works/WorksCarousel";
import { MusicWorksGrid } from "~/presentations/works/MusicWorksGrid";
import { MusicWorkCard } from "~/presentations/works/MusicWorkCard";
import type { ProjectData, MusicWorkData } from "~/types";

const sampleProjects: ProjectData[] = [
  {
    id: "synthetic-project-alpha",
    title: "Synthetic Project Alpha",
    description:
      "Synthetic project alpha provides a high performance routing abstraction. Instead of sending every request to one unoptimized engine, it analyzes each input requirement and directs it to the appropriate subsystem for speed, quality, and cost efficiency. This ensures dependable outcomes, minimal overhead, and governed system integrity across changing conditions. In short, it turns fragmented workload execution into an organized, policy-driven, resilient pipeline that maintains high reliability.",
    thumbnailUrl: "https://example.com/project-alpha-thumb.jpg",
    images: [],
    links: [],
  },
  {
    id: "synthetic-project-beta",
    title: "Synthetic Project Beta",
    description: "A cross-platform experimental client application.",
    thumbnailUrl: "https://example.com/project-beta-thumb.jpg",
    images: [],
    links: [],
  },
];

const sampleScores: MusicWorkData[] = [
  {
    id: "score-101",
    title: "Synthetic Score Alpha",
    scoreUrl: "https://example.com/scores/101",
    thumbnailUrl: "https://example.com/score_101.png",
    partsCount: "1 part",
    pagesCount: "2 pages",
    duration: "02:05",
    date: "Sep 23, 2026",
    views: "2 views",
    instruments: ["Solo Harpsichord", "Harpsichord"],
  },
  {
    id: "score-102",
    title: "Synthetic Score Beta",
    scoreUrl: "https://example.com/scores/102",
    thumbnailUrl: "https://example.com/score_102.png",
    partsCount: "1 part",
    pagesCount: "3 pages",
    duration: "03:14",
    date: "Aug 15, 2026",
    views: "10 views",
    instruments: ["Piano"],
  },
];

vi.mock("~/services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/services")>();
  return {
    ...actual,
    getWorksDataQuery: vi.fn(() => sampleProjects),
    getMusicWorksDataQuery: vi.fn(() => sampleScores),
  };
});

describe("WorksPresentation", () => {
  it("switches tabs between software and music with default state", async () => {
    const { getByRole, getByText, findByText } = render(() => <WorksPresentation />);

    expect(await findByText("Software Development")).toBeDefined();
    expect(getByText("Music")).toBeDefined();
    expect(getByText("Synthetic Project Alpha")).toBeDefined();
    expect(getByText("Synthetic Project Beta")).toBeDefined();

    const musicTab = getByRole("tab", { name: "Music" });
    await fireEvent.click(musicTab);

    expect(await findByText("Synthetic Score Alpha")).toBeDefined();
    expect(getByText("Synthetic Score Beta")).toBeDefined();
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

    expect(getByText("Synthetic Project Alpha")).toBeDefined();
    expect(getByText("Synthetic Project Beta")).toBeDefined();

    const moreButton = getByRole("button", { name: /show more/i });
    expect(moreButton).toBeDefined();
    expect(moreButton.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(moreButton);
    expect(
      getByText(/In short, it turns fragmented workload execution into an organized/i)
    ).toBeDefined();

    const lessButton = getByRole("button", { name: /show less/i });
    expect(lessButton).toBeDefined();
    expect(lessButton.getAttribute("aria-expanded")).toBe("true");

    await fireEvent.click(lessButton);
    expect(
      queryByText(/In short, it turns fragmented workload execution into an organized/i)
    ).toBeNull();
  });

  it("renders empty state in MusicWorksGrid when musicWorks array is empty", () => {
    const { getByText } = render(() => <MusicWorksGrid musicWorks={[]} />);
    expect(getByText("No Music Scores Found")).toBeDefined();
    expect(
      getByText("Music compositions and arrangements are currently being loaded or updated.")
    ).toBeDefined();
  });

  it("renders score items and filters by search query in MusicWorksGrid", async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(() => (
      <MusicWorksGrid musicWorks={sampleScores} />
    ));

    expect(getByText("Synthetic Score Alpha")).toBeDefined();
    expect(getByText("Synthetic Score Beta")).toBeDefined();

    const searchInput = getByPlaceholderText("Search scores or instruments...");
    await fireEvent.input(searchInput, { target: { value: "Alpha" } });

    expect(getByText("Synthetic Score Alpha")).toBeDefined();
    expect(queryByText("Synthetic Score Beta")).toBeNull();
  });

  it("renders music card details and MuseScore external link in MusicWorkCard", () => {
    const { getByText, getByRole } = render(() => (
      <MusicWorkCard score={sampleScores[0]!} />
    ));

    expect(getByText("Synthetic Score Alpha")).toBeDefined();
    expect(getByText("02:05")).toBeDefined();
    expect(getByText("Solo Harpsichord")).toBeDefined();

    const link = getByRole("link", { name: /view on musescore/i });
    expect(link.getAttribute("href")).toBe("https://example.com/scores/101");
  });

  it("handles thumbnail image errors by rendering placeholder fallback", async () => {
    const { container, findByText } = render(() => (
      <MusicWorkCard score={sampleScores[0]!} />
    ));

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    if (img) {
      await fireEvent.error(img);
    }

    expect(await findByText("Sheet Music")).toBeDefined();
  });
});
