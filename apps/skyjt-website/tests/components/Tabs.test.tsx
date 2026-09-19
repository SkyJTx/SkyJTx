import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { Tabs } from "~/components/Tabs";

describe("Tabs component", () => {
  it("renders tabs and panels and handles keyboard navigation", async () => {
    const { getByRole, getByText, queryByText } = render(() => (
      <Tabs defaultValue="first">
        <Tabs.List aria-label="Test Tabs">
          <Tabs.Trigger value="first">First Tab</Tabs.Trigger>
          <Tabs.Trigger value="second">Second Tab</Tabs.Trigger>
          <Tabs.Trigger value="third">Third Tab</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="first">First Content</Tabs.Content>
        <Tabs.Content value="second">Second Content</Tabs.Content>
        <Tabs.Content value="third">Third Content</Tabs.Content>
      </Tabs>
    ));

    const firstTab = getByRole("tab", { name: "First Tab" });
    const secondTab = getByRole("tab", { name: "Second Tab" });
    const thirdTab = getByRole("tab", { name: "Third Tab" });

    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(firstTab.getAttribute("tabIndex")).toBe("0");
    expect(secondTab.getAttribute("aria-selected")).toBe("false");
    expect(secondTab.getAttribute("tabIndex")).toBe("-1");

    expect(getByText("First Content")).toBeDefined();
    expect(queryByText("Second Content")).toBeNull();

    await fireEvent.click(secondTab);
    expect(secondTab.getAttribute("aria-selected")).toBe("true");
    expect(getByText("Second Content")).toBeDefined();
    expect(queryByText("First Content")).toBeNull();

    const tablist = getByRole("tablist");
    await fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(thirdTab.getAttribute("aria-selected")).toBe("true");
    expect(getByText("Third Content")).toBeDefined();

    await fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(getByText("First Content")).toBeDefined();

    await fireEvent.keyDown(tablist, { key: "End" });
    expect(thirdTab.getAttribute("aria-selected")).toBe("true");

    await fireEvent.keyDown(tablist, { key: "Home" });
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
  });
});