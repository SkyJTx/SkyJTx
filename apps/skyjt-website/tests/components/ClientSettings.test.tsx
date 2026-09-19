import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  parseServerCookies,
  isValidHexColor,
  isValidTheme,
  isValidFontSize,
  ClientSettingsModal,
  ClientSettingsProvider,
  useClientSettings,
  DEFAULT_SETTINGS,
} from "~/components/ClientSettings";

describe("ClientSettings subsystem", () => {
  it("validates types and parses server cookies safely", () => {
    expect(isValidTheme("light")).toBe(true);
    expect(isValidTheme("dark")).toBe(true);
    expect(isValidTheme("system")).toBe(true);
    expect(isValidTheme("invalid")).toBe(false);

    expect(isValidHexColor("#4f46e5")).toBe(true);
    expect(isValidHexColor("#xyz")).toBe(false);
    expect(isValidHexColor("red")).toBe(false);

    expect(isValidFontSize("sm")).toBe(true);
    expect(isValidFontSize("xxl")).toBe(false);

    const parsed = parseServerCookies("skyjt_theme=dark; skyjt_seed=%2310b981; skyjt_font_size=lg");
    expect(parsed.theme).toBe("dark");
    expect(parsed.seedColor).toBe("#10b981");
    expect(parsed.fontSize).toBe("lg");
    expect(parsed.resolvedTheme).toBe("dark-seed");

    const fallback = parseServerCookies("skyjt_theme=unknown; skyjt_seed=notacolor; skyjt_font_size=huge");
    expect(fallback.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(fallback.seedColor).toBe(DEFAULT_SETTINGS.seedColor);
    expect(fallback.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
  });

  it("renders ClientSettingsModal and handles open/close", async () => {
    const handleClose = vi.fn();

    const { getByRole, getByLabelText } = render(() => (
      <ClientSettingsProvider>
        <ClientSettingsModal isOpen={true} onClose={handleClose} />
      </ClientSettingsProvider>
    ));

    const dialog = getByRole("dialog");
    expect(dialog).toBeDefined();

    const closeBtn = getByLabelText("Close Settings");
    await fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("provides reactive state and mutations through useClientSettings", async () => {
    function Consumer() {
      const settings = useClientSettings();
      return (
        <div>
          <span data-testid="theme-val">{settings.theme()}</span>
          <span data-testid="seed-val">{settings.seedColor()}</span>
          <span data-testid="font-val">{settings.fontSize()}</span>
          <button type="button" onClick={() => settings.setTheme("light")}>
            Set Light
          </button>
          <button type="button" onClick={() => settings.setSeedColor("#f43f5e")}>
            Set Rose
          </button>
          <button type="button" onClick={() => settings.setFontSize("xl")}>
            Set Extra
          </button>
        </div>
      );
    }

    const { getByTestId, getByText } = render(() => (
      <ClientSettingsProvider>
        <Consumer />
      </ClientSettingsProvider>
    ));

    expect(getByTestId("theme-val").textContent).toBe("system");
    expect(getByTestId("seed-val").textContent).toBe("#4f46e5");
    expect(getByTestId("font-val").textContent).toBe("md");

    await fireEvent.click(getByText("Set Light"));
    expect(getByTestId("theme-val").textContent).toBe("light");

    await fireEvent.click(getByText("Set Rose"));
    expect(getByTestId("seed-val").textContent).toBe("#f43f5e");

    await fireEvent.click(getByText("Set Extra"));
    expect(getByTestId("font-val").textContent).toBe("xl");
  });
});
