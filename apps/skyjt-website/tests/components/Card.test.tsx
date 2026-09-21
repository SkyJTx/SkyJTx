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

  it("renders card with rich JSX element description", () => {
    const { getByRole, getByText } = render(() => (
      <Card
        title="JSX Description Project"
        description={<span data-testid="custom-desc">Rich interactive description</span>}
      />
    ));

    expect(getByRole("heading", { level: 3 }).textContent).toBe("JSX Description Project");
    expect(getByText("Rich interactive description")).toBeDefined();
  });
});
