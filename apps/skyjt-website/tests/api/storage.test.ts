import { describe, it, expect } from "vitest";
import { GET as getStorageStatus } from "~/routes/api/storage/status";
import { GET as getStorageData } from "~/routes/api/storage/data/[type]";
import { GET as getStorageFile } from "~/routes/api/storage/file/[...path]";
import { getMimeType, getStorageContext, getObjectText, getObjectStream } from "~/server/modules/storage";

describe("API Route: /api/storage", () => {
  it("responds to /api/storage/data/personal with JSON payload", async () => {
    const res = await getStorageData({
      request: new Request("http://localhost/api/storage/data/personal"),
      params: { type: "personal" },
    } as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const json = await res.json();
    expect(json).toBeDefined();
    expect(typeof json.fullName).toBe("string");
  });

  it("responds to /api/storage/data/works with JSON array", async () => {
    const res = await getStorageData({
      request: new Request("http://localhost/api/storage/data/works"),
      params: { type: "works" },
    } as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("responds to /api/storage/data/music with JSON array", async () => {
    const res = await getStorageData({
      request: new Request("http://localhost/api/storage/data/music"),
      params: { type: "music" },
    } as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("streams existing file with correct headers and zero buffer copies", async () => {
    const res = await getStorageFile({
      request: new Request("http://localhost/api/storage/file/Works/AIDM/AIDM%20(1).jpg"),
      params: { path: "Works/AIDM/AIDM%20(1).jpg" },
    } as any);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/jpeg");
    expect(res.headers.get("content-disposition")).toBe("inline");
    expect(res.headers.get("cache-control")).toContain("public");
    const arrayBuffer = await res.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(0);
  });

  it("returns 404 for non-existent file", async () => {
    const res = await getStorageFile({
      request: new Request("http://localhost/api/storage/file/non-existent-file-12345.xyz"),
      params: { path: "non-existent-file-12345.xyz" },
    } as any);
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toContain("application/problem+json");
    const body = await res.json();
    expect(body.type).toBe("STORAGE_NOT_FOUND");
    expect(body.code).toBe("STORAGE_NOT_FOUND");
    expect(body.status).toBe(404);
    expect(body.detail).toContain("non-existent-file-12345.xyz");
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

  describe("Storage Status API", () => {
    it("exposes storageReady and storageContext", async () => {
      const res = await getStorageStatus({
        request: new Request("http://localhost/api/storage/status"),
      } as any);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.storageReady).toBe(true);
      expect(json.hasStorage).toBe(true);
      expect(json.hasContext).toBe(true);
    });
  });

  describe("Result tuple service contracts", () => {
    it("returns [data, undefined] on valid storage context", () => {
      const [context, error] = getStorageContext();
      expect(error).toBeUndefined();
      expect(context).toBeDefined();
      expect(typeof context?.bucket).toBe("string");
    });

    it("returns [data, undefined] on valid getObjectText", async () => {
      const [text, error] = await getObjectText("personalInfo.json");
      expect(error).toBeUndefined();
      expect(typeof text).toBe("string");
    });

    it("returns [data, undefined] on valid getObjectStream", async () => {
      const [streamResult, error] = await getObjectStream("Works/AIDM/AIDM (1).jpg");
      expect(error).toBeUndefined();
      expect(streamResult).toBeDefined();
      expect(streamResult?.stream).toBeDefined();
    });

    it("returns [undefined, error] with StorageNotFoundError on missing key", async () => {
      const [text, error] = await getObjectText("missing-file-xyz.json");
      expect(text).toBeUndefined();
      expect(error).toBeDefined();
      expect(error?.code).toBe("STORAGE_NOT_FOUND");
      expect(error?.status).toBe(404);
    });
  });
});