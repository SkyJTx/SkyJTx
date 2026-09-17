import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import type { RouteSectionProps } from "@solidjs/router";
import MainLayout from "./(main)";

describe("MainLayout", () => {
  it("renders navigation and child content", () => {
    const testProps: RouteSectionProps = {
      params: {},
      location: {
        pathname: "/",
        search: "",
        hash: "",
        state: null,
        query: {},
        key: "",
      },
      data: undefined,
      children: <div>Child Content</div>,
    };

    const { getByRole, getByText } = render(() => (
      <MainLayout {...testProps} />
    ));

    expect(getByRole("navigation")).toBeDefined();
    expect(getByText("Home")).toBeDefined();
    expect(getByText("User 42")).toBeDefined();
    expect(getByText("Child Content")).toBeDefined();
  });
});
