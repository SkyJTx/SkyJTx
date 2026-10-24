import { describe, it, expect } from "vitest";
import app from "~/server";
import { getMimeType } from "~/server/modules/storage";

describe("API Route: /api/storage", () => {
  it("responds to /api/storage/data/personal with JSON payload", async () => {
    const res = await app.fetch(new Request("http://localhost/api/storage/data/personal"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const json = await res.json();
    expect(json).toBeDefined();
    expect(typeof json.fullName).toBe("string");
  });

  it("responds to /api/storage/data/works with JSON array", async () => {
    const res = await app.fetch(new Request("http://localhost/api/storage/data/works"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("responds to /api/storage/data/music with JSON array", async () => {
    const res = await app.fetch(new Request("http://localhost/api/storage/data/music"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("returns 404 for non-existent file", async () => {
    const res = await app.fetch(new Request("http://localhost/api/storage/file/non-existent-file-12345.xyz"));
    expect(res.status).toBe(404);
  });

  describe("getMimeType with mime package", () => {
    it("resolves standard web formats correctly", () => {
      expect(getMimeType("image.png")).toBe("image/png");
      expect(getMimeType("photo.jpeg")).toBe("image/jpeg");
      expect(getMimeType("document.pdf")).toBe("application/pdf");
      expect(getMimeType("data.json")).toBe("application/json");
      expect(getMimeType("vector.svg")).toBe("image/svg+xml");
      expect(getMimeType("banner.webp")).toBe("image/webp");
      expect(getMimeType("modern.avif")).toBe("image/avif");
    });

    it("resolves audio and sheet music formats for the music portfolio", () => {
      expect(getMimeType("track.mp3")).toBe("audio/mpeg");
      expect(getMimeType("recording.wav")).toBe("audio/wav");
      expect(getMimeType("score.musicxml")).toBe("application/vnd.recordare.musicxml+xml");
      expect(getMimeType("theme.midi")).toBe("audio/midi");
    });

    it("strips URL query strings and hash fragments", () => {
      expect(getMimeType("image.png?v=2")).toBe("image/png");
      expect(getMimeType("sheet.pdf#page=4")).toBe("application/pdf");
      expect(getMimeType("audio.mp3?token=abc#t=10")).toBe("audio/mpeg");
    });

    it("falls back to application/octet-stream for unknown extensions", () => {
      expect(getMimeType("unknown.customext123")).toBe("application/octet-stream");
      expect(getMimeType("no_extension")).toBe("application/octet-stream");
    });
  });
});
