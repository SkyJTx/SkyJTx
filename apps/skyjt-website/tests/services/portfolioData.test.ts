import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchWorksData,
  fetchPersonalInfo,
  WorksDataSchema,
  PersonalInfoSchema,
  SUPABASE_WORKS_URL,
  SUPABASE_PERSONAL_URL,
  NOT_FOUND_PERSONAL_INFO,
  NOT_FOUND_PROJECTS,
} from "~/services/portfolioData";
import type { ProjectData } from "~/types";
import * as v from "valibot";

describe("portfolioData service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("schema validation", () => {
    it("validates valid works data structure", () => {
      const mockProjects: ProjectData[] = [
        {
          id: "test-proj",
          title: "Test Project",
          description: "A valid test project description.",
          thumbnailUrl: "https://example.com/thumb.jpg",
          images: [{ src: "https://example.com/img.jpg", alt: "alt" }],
          links: [{ label: "Code", url: "https://github.com", icon: "github" }],
        },
      ];

      const result = v.safeParse(WorksDataSchema, mockProjects);
      expect(result.success).toBe(true);
    });

    it("rejects invalid works data structure", () => {
      const invalidData = [{ id: 123, title: null }];
      const result = v.safeParse(WorksDataSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("validates valid personal info structure", () => {
      const result = v.safeParse(PersonalInfoSchema, NOT_FOUND_PERSONAL_INFO);
      expect(result.success).toBe(true);
    });
  });

  describe("fetchWorksData", () => {
    it("returns parsed project data on successful remote response", async () => {
      const mockProjects: ProjectData[] = [
        {
          id: "remote-p1",
          title: "Remote Project",
          description: "Fetched from Supabase",
          thumbnailUrl: "https://example.com/p1.jpg",
          images: [],
          links: [],
        },
      ];

      vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url === SUPABASE_WORKS_URL) {
          return Promise.resolve(
            new Response(JSON.stringify(mockProjects), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            })
          );
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      const data = await fetchWorksData();
      expect(data).toHaveLength(1);
      expect(data[0]?.id).toBe("remote-p1");
    });

    it("falls back to empty NOT_FOUND_PROJECTS when fetch fails", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("Not Found", { status: 404 })
      );

      const data = await fetchWorksData();
      expect(data).toEqual(NOT_FOUND_PROJECTS);
    });
  });

  describe("fetchPersonalInfo", () => {
    it("returns parsed personal info on successful remote response", async () => {
      const mockInfo = {
        fullName: "Jane Doe",
        tagline: "Software Architect",
        description: "Building systems.",
        location: "Tokyo, Japan",
        email: "jane@example.com",
        phone: "+81 00 000 0000",
        githubUrl: "https://github.com/janedoe",
        linkedinUrl: "https://linkedin.com/in/janedoe",
        musescoreUrl: "https://musescore.com/janedoe",
        resumeUrl: "https://example.com/cv.pdf",
        myselfPhotoUrl: "https://example.com/me.jpg",
      };

      vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url === SUPABASE_PERSONAL_URL) {
          return Promise.resolve(
            new Response(JSON.stringify(mockInfo), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            })
          );
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      const data = await fetchPersonalInfo();
      expect(data.fullName).toBe("Jane Doe");
      expect(data.location).toBe("Tokyo, Japan");
    });

    it("falls back to NOT_FOUND_PERSONAL_INFO on network error", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network failed"));

      const data = await fetchPersonalInfo();
      expect(data).toEqual(NOT_FOUND_PERSONAL_INFO);
    });
  });
});
