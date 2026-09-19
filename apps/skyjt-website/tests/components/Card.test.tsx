import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Card } from "~/components/Card";

describe("Card component", () => {
  it("renders card with title, description, and actions", () => {
    const { getByRole, getByText } = render(() => (
      <Card
        title="Test Project"
        description="A great project description"
        actions={<button type="button">Visit</button>}
      />
    ));

    expect(getByRole("heading", { level: 3 }).textContent).toBe("Test Project");
    expect(getByText("A great project description")).toBeDefined();
    expect(getByRole("button", { name: "Visit" })).toBeDefined();
  });
});
