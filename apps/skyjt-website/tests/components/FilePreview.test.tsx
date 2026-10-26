import { render, fireEvent, screen, cleanup } from "@solidjs/testing-library";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { FilePreview } from "~/components/FilePreview";

describe("FilePreview component", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when isOpen is false", () => {
    const handleClose = vi.fn();
    const { queryByRole } = render(() => (
      <FilePreview
        isOpen={false}
        url="https://example.com/test.png"
        name="Test Preview"
        onClose={handleClose}
      />
    ));

    expect(queryByRole("dialog")).toBeNull();
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders dialog and triggers onClose on dismiss", async () => {
    const handleClose = vi.fn();
    render(() => (
      <FilePreview
        isOpen={true}
        url="https://example.com/test.png"
        name="Test Preview"
        onClose={handleClose}
      />
    ));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();

    const closeBtn = screen.getByLabelText("Close Preview");
    await fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders cardless floating controls and title/subtitle badge", () => {
    const handleClose = vi.fn();
    render(() => (
      <FilePreview
        isOpen={true}
        url="https://example.com/mock-design.png"
        name="Mock Architecture Diagram"
        date="October 2026"
        onClose={handleClose}
      />
    ));

    expect(screen.getByText("Mock Architecture Diagram")).toBeDefined();
    expect(screen.getByText("October 2026")).toBeDefined();
    expect(screen.getByLabelText("Copy URL")).toBeDefined();
    expect(screen.getByLabelText("Download File")).toBeDefined();
    expect(screen.getByLabelText("Open in New Tab")).toBeDefined();
    expect(screen.getByLabelText("Close Preview")).toBeDefined();

    const img = screen.getByAltText("Mock Architecture Diagram");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toBe("https://example.com/mock-design.png");
  });

  it("triggers onClose when clicking overlay backdrop", async () => {
    const handleClose = vi.fn();
    render(() => (
      <FilePreview
        isOpen={true}
        url="https://example.com/mock-design.png"
        name="Mock Architecture Diagram"
        onClose={handleClose}
      />
    ));

    const overlay = document.querySelector(".cursor-pointer.backdrop-blur-md");
    expect(overlay).not.toBeNull();
    if (overlay) {
      await fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });
});
