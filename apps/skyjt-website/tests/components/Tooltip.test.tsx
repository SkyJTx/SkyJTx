import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "~/components/Tooltip";

describe("Tooltip component", () => {
  it("renders trigger and displays tooltip on mouse enter and keyboard focus", async () => {
    vi.useFakeTimers();

    const { getByRole, queryByRole } = render(() => (
      <Tooltip content="Tooltip Content" openDelay={50} closeDelay={50}>
        <button type="button">Trigger</button>
      </Tooltip>
    ));

    const trigger = getByRole("button", { name: "Trigger" });
    const container = trigger.parentElement;
    if (!container) throw new Error("Trigger must have a parent container");

    expect(queryByRole("tooltip")).toBeNull();

    await fireEvent.mouseEnter(container);
    await vi.advanceTimersByTimeAsync(100);
    expect(getByRole("tooltip")).toBeDefined();
    expect(getByRole("tooltip").textContent).toBe("Tooltip Content");

    await fireEvent.mouseLeave(container);
    await vi.advanceTimersByTimeAsync(100);
    expect(queryByRole("tooltip")).toBeNull();

    await fireEvent.focusIn(container);
    expect(getByRole("tooltip")).toBeDefined();

    await fireEvent.keyDown(container, { key: "Escape" });
    expect(queryByRole("tooltip")).toBeNull();

    vi.useRealTimers();
  });
});