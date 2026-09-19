import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { createSignal } from "solid-js";
import { usePresence } from "~/utils/presence";
import { SegmentButton, type SegmentOption } from "~/components/SegmentButton";
import { NavigationMenu } from "~/components/NavigationBar/NavigationMenu";
import { Tabs } from "~/components/Tabs";
import { ClientSettingsModal, ClientSettingsProvider } from "~/components/ClientSettings";

describe("Animation subsystem integration", () => {
  it("orchestrates presence enter and delayed unmount exit lifecycles", async () => {
    vi.useFakeTimers();

    function PresenceTester() {
      const [isOpen, setIsOpen] = createSignal(false);
      const presence = usePresence(isOpen, { exitDuration: 150, enterDuration: 100 });

      return (
        <div>
          <button type="button" onClick={() => setIsOpen(!isOpen())}>
            Toggle
          </button>
          <span data-testid="mounted">{presence.isMounted() ? "yes" : "no"}</span>
          <span data-testid="visible">{presence.isVisible() ? "yes" : "no"}</span>
        </div>
      );
    }

    const { getByRole, getByTestId } = render(() => <PresenceTester />);
    const toggleBtn = getByRole("button", { name: "Toggle" });

    expect(getByTestId("mounted").textContent).toBe("no");
    expect(getByTestId("visible").textContent).toBe("no");

    // Open
    await fireEvent.click(toggleBtn);
    expect(getByTestId("mounted").textContent).toBe("yes");

    await vi.advanceTimersByTimeAsync(50);
    expect(getByTestId("visible").textContent).toBe("yes");

    // Close
    await fireEvent.click(toggleBtn);
    expect(getByTestId("visible").textContent).toBe("no");
    expect(getByTestId("mounted").textContent).toBe("yes"); // Still mounted during exit window

    await vi.advanceTimersByTimeAsync(160);
    expect(getByTestId("mounted").textContent).toBe("no"); // Unmounted after exitDuration

    vi.useRealTimers();
  });

  it("SegmentButton smoothly updates active state and radio aria attributes", async () => {
    const options: readonly SegmentOption<string>[] = [
      { value: "choice1", label: "Choice One" },
      { value: "choice2", label: "Choice Two" },
      { value: "choice3", label: "Choice Three" },
    ];

    function SegmentTester() {
      const [val, setVal] = createSignal("choice1");
      return (
        <SegmentButton
          options={options}
          value={val()}
          onChange={setVal}
          ariaLabel="Tester Segment"
        />
      );
    }

    const { getAllByRole } = render(() => <SegmentTester />);
    const radios = getAllByRole("radio");

    expect(radios[0].getAttribute("aria-checked")).toBe("true");
    expect(radios[1].getAttribute("aria-checked")).toBe("false");

    await fireEvent.click(radios[1]);
    expect(radios[0].getAttribute("aria-checked")).toBe("false");
    expect(radios[1].getAttribute("aria-checked")).toBe("true");
  });

  it("NavigationMenu tracks active section and moves indicator", async () => {
    const sections = ["Home", "Works", "About", "Contacts"] as const;
    const handleSelect = vi.fn();

    function NavTester() {
      const [active, setActive] = createSignal<string>("Home");
      return (
        <div>
          <button type="button" onClick={() => setActive("Works")}>
            Switch to Works
          </button>
          <NavigationMenu
            sections={sections}
            activeSection={active()}
            onSelectSection={(s) => {
              setActive(s);
              handleSelect(s);
            }}
          />
        </div>
      );
    }

    const { getByRole, getAllByRole } = render(() => <NavTester />);
    const homeBtn = getByRole("button", { name: "Home" });
    const worksBtn = getByRole("button", { name: "Works" });

    expect(homeBtn.getAttribute("aria-current")).toBe("page");
    expect(worksBtn.getAttribute("aria-current")).toBeNull();

    await fireEvent.click(worksBtn);
    expect(handleSelect).toHaveBeenCalledWith("Works");
    expect(worksBtn.getAttribute("aria-current")).toBe("page");
    expect(homeBtn.getAttribute("aria-current")).toBeNull();
  });

  it("ClientSettingsModal renders with animated presence classes", async () => {
    const handleClose = vi.fn();

    const { getByRole } = render(() => (
      <ClientSettingsProvider>
        <ClientSettingsModal isOpen={true} onClose={handleClose} />
      </ClientSettingsProvider>
    ));

    const dialog = getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.className).toContain("transition-all");
    expect(dialog.className).toContain("duration-200");
  });

  it("Tabs component displays sliding indicator and animated content panels", async () => {
    const { getByRole, getByText, queryByText } = render(() => (
      <Tabs defaultValue="tabA">
        <Tabs.List aria-label="Animated Tabs">
          <Tabs.Trigger value="tabA">Tab A</Tabs.Trigger>
          <Tabs.Trigger value="tabB">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tabA">Panel A Content</Tabs.Content>
        <Tabs.Content value="tabB">Panel B Content</Tabs.Content>
      </Tabs>
    ));

    const tabA = getByRole("tab", { name: "Tab A" });
    const tabB = getByRole("tab", { name: "Tab B" });

    expect(tabA.getAttribute("aria-selected")).toBe("true");
    const panelA = getByText("Panel A Content");
    expect(panelA.className).toContain("animate-fade-in");
    expect(queryByText("Panel B Content")).toBeNull();

    await fireEvent.click(tabB);
    expect(tabB.getAttribute("aria-selected")).toBe("true");
    const panelB = getByText("Panel B Content");
    expect(panelB.className).toContain("animate-fade-in");
    expect(queryByText("Panel A Content")).toBeNull();
  });
});