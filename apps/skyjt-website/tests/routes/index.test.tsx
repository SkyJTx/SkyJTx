import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { NavigationProvider } from "~/components/NavigationBar";
import Home, { route } from "~/routes/(main)/index";

describe("Home route", () => {
  it("renders portfolio hero, about, works, and contacts sections", async () => {
    const { getByText, findByText } = render(() => (
      <NavigationProvider>
        <Home />
      </NavigationProvider>
    ));

    expect(await findByText("About Me")).toBeDefined();
    expect(getByText("My Works")).toBeDefined();
    expect(getByText("Get in Touch")).toBeDefined();
    expect(await findByText("Software Development")).toBeDefined();
    expect(getByText("Music")).toBeDefined();
  });

  it("exports defineRoute with preload function", () => {
    expect(route).toBeDefined();
    expect(typeof route.config.preload).toBe("function");
  });
});
