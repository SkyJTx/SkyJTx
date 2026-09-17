import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import Home from "./index";

describe("Home route", () => {
  it("renders home heading and link", () => {
    const { getByRole, getByText } = render(() => <Home />);
    expect(getByRole("heading", { level: 1 }).textContent).toBe("SkyJT Website");
    expect(getByText("View User 42 (Profile)")).toBeDefined();
    const link = getByRole("link");
    expect(link.getAttribute("href")).toBe("/users/42?tab=profile&tag=solid&tag=typed-routes");
  });
});
