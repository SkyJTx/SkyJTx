import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import Home from "./(main)/index";

describe("Home route", () => {
  it("renders home heading and link", () => {
    const { getByRole, getByText } = render(() => <Home />);
    expect(getByRole("heading", { level: 1 }).textContent).toBe("SkyJT Website");
    expect(getByText("View User 42")).toBeDefined();
    const link = getByRole("link");
    expect(link.getAttribute("href")).toBe("/user/42");
  });
});
