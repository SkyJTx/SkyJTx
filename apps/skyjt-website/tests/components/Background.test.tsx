import { render } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Background } from "~/components/Background";

describe("Background component", () => {
  let originalResizeObserver: typeof ResizeObserver | undefined;
  let getContextSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalResizeObserver = globalThis.ResizeObserver;
    if (!globalThis.ResizeObserver) {
      class MockResizeObserver implements ResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      }
      globalThis.ResizeObserver = MockResizeObserver;
    }

    const mockCtx = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      scale: vi.fn(),
      resetTransform: vi.fn(),
    };

    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockImplementation((contextId: string) => {
        if (contextId === "2d") {
          return mockCtx as unknown as CanvasRenderingContext2D;
        }
        return null;
      });
  });

  afterEach(() => {
    getContextSpy.mockRestore();
    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver;
    }
  });

  it("renders canvas element and children content correctly", () => {
    const { container, getByText } = render(() => (
      <Background>
        <div>Test Child Content</div>
      </Background>
    ));

    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.className).toContain("fixed inset-0 w-full h-screen");
    expect(getByText("Test Child Content")).toBeDefined();
  });

  it("initializes canvas context and cleans up on unmount", () => {
    const cancelAnimSpy = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(() => (
      <Background>
        <div>Render Child</div>
      </Background>
    ));

    expect(getContextSpy).toHaveBeenCalledWith("2d");

    unmount();

    expect(cancelAnimSpy).toHaveBeenCalled();
    cancelAnimSpy.mockRestore();
  });
});
