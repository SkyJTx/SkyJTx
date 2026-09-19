import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { createSignal } from "solid-js";
import { SegmentButton, type SegmentOption } from "~/components/SegmentButton";

describe("SegmentButton component", () => {
  const options: readonly SegmentOption<string>[] = [
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "gamma", label: "Gamma" },
  ];

  it("renders radiogroup and options with correct accessibility attributes", async () => {
    const handleChange = vi.fn();

    const { getByRole, getAllByRole } = render(() => (
      <SegmentButton
        options={options}
        value="alpha"
        onChange={handleChange}
        name="test-segment"
        ariaLabel="Test Segment"
      />
    ));

    const radiogroup = getByRole("radiogroup", { name: "Test Segment" });
    expect(radiogroup).toBeDefined();

    const radios = getAllByRole("radio");
    expect(radios.length).toBe(3);

    expect(radios[0].getAttribute("aria-checked")).toBe("true");
    expect(radios[0].getAttribute("tabindex")).toBe("0");
    expect(radios[1].getAttribute("aria-checked")).toBe("false");
    expect(radios[1].getAttribute("tabindex")).toBe("-1");

    await fireEvent.click(radios[1]);
    expect(handleChange).toHaveBeenCalledWith("beta");
  });

  it("handles keyboard navigation between options", async () => {
    function ControlledTest() {
      const [val, setVal] = createSignal("alpha");
      return (
        <SegmentButton
          options={options}
          value={val()}
          onChange={setVal}
          ariaLabel="Keyboard Segment"
        />
      );
    }

    const { getAllByRole } = render(() => <ControlledTest />);
    const radios = getAllByRole("radio");

    await fireEvent.keyDown(radios[0], { key: "ArrowRight" });
    expect(radios[1].getAttribute("aria-checked")).toBe("true");

    await fireEvent.keyDown(radios[1], { key: "End" });
    expect(radios[2].getAttribute("aria-checked")).toBe("true");

    await fireEvent.keyDown(radios[2], { key: "Home" });
    expect(radios[0].getAttribute("aria-checked")).toBe("true");

    await fireEvent.keyDown(radios[0], { key: "ArrowLeft" });
    expect(radios[2].getAttribute("aria-checked")).toBe("true");
  });
});
