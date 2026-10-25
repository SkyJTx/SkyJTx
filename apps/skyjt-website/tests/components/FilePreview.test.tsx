import { render, fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { FilePreview } from "~/components/FilePreview";

describe("FilePreview component", () => {
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
});
