import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { ExpandableText, truncateAtWord } from "~/components/ExpandableText";

describe("truncateAtWord", () => {
  it("returns full text when length is less than or equal to maxLength", () => {
    expect(truncateAtWord("Short text", 20)).toBe("Short text");
    expect(truncateAtWord("Exact length", 12)).toBe("Exact length");
  });

  it("truncates at word boundary with ellipsis when exceeding maxLength", () => {
    const text = "Clean food good router is the intelligence layer for the multi-model AI era.";
    const truncated = truncateAtWord(text, 30);
    expect(truncated).toBe("Clean food good router is the...");
    expect(truncated.length).toBeLessThanOrEqual(30 + 3);
  });
});

describe("ExpandableText component", () => {
  const shortText = "A concise project description.";
  const longText =
    "Clean food good router is the intelligence layer for the multi-model AI era. Instead of sending every request to one expensive model, it analyzes each user need and routes it to the best-fit AI engine based on speciality for quality, speed, and cost.";

  it("renders short text fully without toggle button", () => {
    const { getByText, queryByRole } = render(() => <ExpandableText text={shortText} maxLength={50} />);

    expect(getByText(shortText)).toBeDefined();
    expect(queryByRole("button")).toBeNull();
  });

  it("renders long text truncated with Show more button", () => {
    const { getByRole, getByText, queryByText } = render(() => (
      <ExpandableText text={longText} maxLength={100} />
    ));

    const button = getByRole("button", { name: /show more/i });
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(queryByText(longText)).toBeNull();
  });

  it("expands to full text when Show more is clicked and collapses when Show less is clicked", async () => {
    const { getByRole, getByText, queryByText } = render(() => (
      <ExpandableText text={longText} maxLength={100} />
    ));

    const moreButton = getByRole("button", { name: /show more/i });
    await fireEvent.click(moreButton);

    expect(getByText(longText)).toBeDefined();
    const lessButton = getByRole("button", { name: /show less/i });
    expect(lessButton).toBeDefined();
    expect(lessButton.getAttribute("aria-expanded")).toBe("true");

    await fireEvent.click(lessButton);
    expect(queryByText(longText)).toBeNull();
    expect(getByRole("button", { name: /show more/i })).toBeDefined();
  });

  it("respects custom moreText and lessText properties", async () => {
    const { getByRole } = render(() => (
      <ExpandableText
        text={longText}
        maxLength={100}
        moreText="Read detail"
        lessText="Hide detail"
      />
    ));

    const customMore = getByRole("button", { name: /read detail/i });
    expect(customMore).toBeDefined();

    await fireEvent.click(customMore);
    const customLess = getByRole("button", { name: /hide detail/i });
    expect(customLess).toBeDefined();
  });
});
