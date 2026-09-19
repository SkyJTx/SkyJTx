import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { WorksPresentation } from "~/presentations/works";

describe("WorksPresentation", () => {
  it("switches tabs between software and music", async () => {
    const { getByRole, getByText, queryByText } = render(() => <WorksPresentation />);

    expect(getByText("Software Development")).toBeDefined();
    expect(getByText("Music")).toBeDefined();
    expect(getByText("RuamMitr")).toBeDefined();

    const musicTab = getByRole("tab", { name: "Music" });
    await fireEvent.click(musicTab);

    expect(getByText("Music compositions and arrangements are being prepared. Check back soon for updates.")).toBeDefined();
  });
});
