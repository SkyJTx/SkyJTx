import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { NavigationProvider } from "~/components/NavigationBar";
import Home from "~/routes/(main)/index";

describe("Home route", () => {
  it("renders portfolio hero, about, works, and contacts sections", () => {
    const { getByRole, getByText } = render(() => (
      <NavigationProvider>
        <Home />
      </NavigationProvider>
    ));

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Nattakarn Khumsupha");
    expect(getByText("About Me")).toBeDefined();
    expect(getByText("My Works")).toBeDefined();
    expect(getByText("Get in Touch")).toBeDefined();
    expect(getByText("RuamMitr")).toBeDefined();
    expect(getByText("Software Development")).toBeDefined();
    expect(getByText("Music")).toBeDefined();
  });
});
