import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { WorksPresentation } from "~/presentations/works";

describe("WorksPresentation", () => {
  it("switches tabs between software and music", async () => {
    const { getByRole, getByText } = render(() => <WorksPresentation />);

    expect(getByText("Software Development")).toBeDefined();
    expect(getByText("Music")).toBeDefined();
    expect(getByText("RuamMitr")).toBeDefined();
    expect(getByText("Clean Food Good Router")).toBeDefined();

    const musicTab = getByRole("tab", { name: "Music" });
    await fireEvent.click(musicTab);

    expect(getByText("Music compositions and arrangements are being prepared. Check back soon for updates.")).toBeDefined();
  });

  it("truncates long work description with Show more toggle for Clean Food Good Router", async () => {
    const { getByRole, getByText, queryByText } = render(() => <WorksPresentation />);

    const moreButton = getByRole("button", { name: /show more/i });
    expect(moreButton).toBeDefined();
    expect(moreButton.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(moreButton);
    expect(getByText(/In short, it turns fragmented AI usage into a scalable/i)).toBeDefined();

    const lessButton = getByRole("button", { name: /show less/i });
    expect(lessButton).toBeDefined();
    expect(lessButton.getAttribute("aria-expanded")).toBe("true");

    await fireEvent.click(lessButton);
    expect(queryByText(/In short, it turns fragmented AI usage into a scalable/i)).toBeNull();
  });
});
