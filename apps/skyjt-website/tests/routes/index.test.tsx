import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { NavigationProvider } from "~/components/NavigationBar";
import Home from "~/routes/(main)/index";

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
});
