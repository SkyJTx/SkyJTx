import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { NavigationBar } from "~/components/NavigationBar";
import { ClientSettingsProvider } from "~/components/ClientSettings";

describe("NavigationBar component with Dynamic Island", () => {
  const sections = ["Home", "About", "Works", "Contacts"] as const;

  it("renders mobile DynamicIslandTrigger with active section label", () => {
    const handleSelect = vi.fn();
    const { getByRole } = render(() => (
      <ClientSettingsProvider>
        <NavigationBar
          sections={sections}
          activeSection="Home"
          onSelectSection={handleSelect}
        />
      </ClientSettingsProvider>
    ));

    const trigger = getByRole("button", { name: /Current section: Home/i });
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.textContent).toContain("Home");
  });

  it("expands dynamic island upon click and allows section navigation", async () => {
    const handleSelect = vi.fn();
    const { getByRole, getAllByRole, queryByRole } = render(() => (
      <ClientSettingsProvider>
        <NavigationBar
          sections={sections}
          activeSection="Home"
          onSelectSection={handleSelect}
        />
      </ClientSettingsProvider>
    ));

    const trigger = getByRole("button", { name: /Current section: Home/i });
    await fireEvent.click(trigger);

    // Expanded menu is now visible
    const closeBtn = getByRole("button", { name: "Close navigation menu" });
    expect(closeBtn).toBeDefined();

    // Select "Works" section
    const worksButtons = getAllByRole("button", { name: "Works" });
    expect(worksButtons.length).toBeGreaterThan(0);
    await fireEvent.click(worksButtons[0]);

    expect(handleSelect).toHaveBeenCalledWith("Works");

    // Menu collapses after selection
    expect(queryByRole("button", { name: "Close navigation menu" })).toBeNull();
  });

  it("collapses dynamic island when clicking close button", async () => {
    const handleSelect = vi.fn();
    const { getByRole, queryByRole } = render(() => (
      <ClientSettingsProvider>
        <NavigationBar
          sections={sections}
          activeSection="About"
          onSelectSection={handleSelect}
        />
      </ClientSettingsProvider>
    ));

    const trigger = getByRole("button", { name: /Current section: About/i });
    await fireEvent.click(trigger);

    const closeBtn = getByRole("button", { name: "Close navigation menu" });
    await fireEvent.click(closeBtn);

    expect(queryByRole("button", { name: "Close navigation menu" })).toBeNull();
  });

  it("collapses dynamic island on Escape key press", async () => {
    const handleSelect = vi.fn();
    const { getByRole, queryByRole } = render(() => (
      <ClientSettingsProvider>
        <NavigationBar
          sections={sections}
          activeSection="Works"
          onSelectSection={handleSelect}
        />
      </ClientSettingsProvider>
    ));

    const trigger = getByRole("button", { name: /Current section: Works/i });
    await fireEvent.click(trigger);

    expect(getByRole("button", { name: "Close navigation menu" })).toBeDefined();

    await fireEvent.keyDown(window, { key: "Escape" });

    expect(queryByRole("button", { name: "Close navigation menu" })).toBeNull();
  });

  it("triggers ClientSettingsModal from navigation action", async () => {
    const handleSelect = vi.fn();
    const { getAllByRole, getByRole } = render(() => (
      <ClientSettingsProvider>
        <NavigationBar
          sections={sections}
          activeSection="Home"
          onSelectSection={handleSelect}
        />
      </ClientSettingsProvider>
    ));

    // Open settings from desktop or expanded mobile action button
    const settingsBtns = getAllByRole("button", { name: "Open Client Settings" });
    expect(settingsBtns.length).toBeGreaterThan(0);
    await fireEvent.click(settingsBtns[0]);

    const modal = getByRole("dialog");
    expect(modal).toBeDefined();
  });
});
