import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchWorksData,
  fetchPersonalInfo,
  fetchMusicWorksData,
  getWorksDataQuery,
  getPersonalInfoQuery,
  getMusicWorksDataQuery,
  clearPortfolioCache,
  WorksDataSchema,
  MusicWorksDataSchema,
  PersonalInfoSchema,
  SUPABASE_WORKS_URL,
  SUPABASE_PERSONAL_URL,
  SUPABASE_MUSIC_WORKS_URL,
  NOT_FOUND_PERSONAL_INFO,
  NOT_FOUND_PROJECTS,
  NOT_FOUND_MUSIC_WORKS,
  PORTFOLIO_QUERY_KEYS,
  PORTFOLIO_CACHE_TTL_MS,
  PROJECT_LINK_ICONS,
} from "~/services/portfolioData";
import {
  PORTFOLIO_QUERY_KEYS as CONST_PORTFOLIO_QUERY_KEYS,
  PORTFOLIO_CACHE_TTL_MS as CONST_PORTFOLIO_CACHE_TTL_MS,
  PROJECT_LINK_ICONS as CONST_PROJECT_LINK_ICONS,
} from "~/constants";
import type { ProjectData, MusicWorkData } from "~/types";
import * as v from "valibot";

describe("portfolioData service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearPortfolioCache();
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

    it("validates valid music works data structure", () => {
      const mockScores: MusicWorkData[] = [
        {
          id: "score-101",
          title: "Synthetic Composition Alpha",
          scoreUrl: "https://example.com/scores/101",
          thumbnailUrl: "https://example.com/score_101.png",
          partsCount: "1 part",
          pagesCount: "2 pages",
          duration: "02:05",
          date: "Sep 23, 2026",
          views: "2 views",
          instruments: ["Solo Harpsichord", "Harpsichord"],
        },
      ];

      const result = v.safeParse(MusicWorksDataSchema, mockScores);
      expect(result.success).toBe(true);
    });

    it("rejects invalid music works data structure", () => {
      const invalidScores = [{ id: 123, title: null }];
      const result = v.safeParse(MusicWorksDataSchema, invalidScores);
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

    it("uses in-memory cache on consecutive calls within TTL", async () => {
      const mockProjects: ProjectData[] = [
        {
          id: "cached-p1",
          title: "Cached Project",
          description: "Fetched once",
          thumbnailUrl: "https://example.com/p1.jpg",
          images: [],
          links: [],
        },
      ];

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(mockProjects), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      const data1 = await fetchWorksData();
      const data2 = await fetchWorksData();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(data1).toEqual(data2);
    });

    it("falls back to empty NOT_FOUND_PROJECTS when fetch fails", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("Not Found", { status: 404 })
      );

      const data = await fetchWorksData();
      expect(data).toEqual(NOT_FOUND_PROJECTS);
    });
  });

  describe("fetchMusicWorksData", () => {
    it("returns parsed music works on successful remote response", async () => {
      const mockScores: MusicWorkData[] = [
        {
          id: "score-1",
          title: "Test Score",
          scoreUrl: "https://musescore.com/score/1",
          thumbnailUrl: "https://example.com/score1.png",
          instruments: ["Piano"],
        },
      ];

      vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url === SUPABASE_MUSIC_WORKS_URL) {
          return Promise.resolve(
            new Response(JSON.stringify(mockScores), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            })
          );
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      const data = await fetchMusicWorksData();
      expect(data).toHaveLength(1);
      expect(data[0]?.id).toBe("score-1");
    });

    it("uses in-memory cache on consecutive calls within TTL", async () => {
      const mockScores: MusicWorkData[] = [
        {
          id: "cached-score",
          title: "Cached Score",
          scoreUrl: "https://musescore.com/score/2",
          thumbnailUrl: "https://example.com/score2.png",
          instruments: ["Harpsichord"],
        },
      ];

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(mockScores), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      const data1 = await fetchMusicWorksData();
      const data2 = await fetchMusicWorksData();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(data1).toEqual(data2);
    });

    it("falls back to empty NOT_FOUND_MUSIC_WORKS when fetch fails", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("Not Found", { status: 404 })
      );

      const data = await fetchMusicWorksData();
      expect(data).toEqual(NOT_FOUND_MUSIC_WORKS);
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

    it("uses in-memory cache on consecutive calls within TTL", async () => {
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

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(mockInfo), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      const data1 = await fetchPersonalInfo();
      const data2 = await fetchPersonalInfo();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(data1).toEqual(data2);
    });

    it("falls back to NOT_FOUND_PERSONAL_INFO on network error", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network failed"));

      const data = await fetchPersonalInfo();
      expect(data).toEqual(NOT_FOUND_PERSONAL_INFO);
    });
  });

  describe("query integration", () => {
    it("exports getWorksDataQuery, getPersonalInfoQuery, and getMusicWorksDataQuery", () => {
      expect(typeof getWorksDataQuery).toBe("function");
      expect(typeof getPersonalInfoQuery).toBe("function");
      expect(typeof getMusicWorksDataQuery).toBe("function");
      expect(getWorksDataQuery.key).toBe(PORTFOLIO_QUERY_KEYS.WORKS);
      expect(getPersonalInfoQuery.key).toBe(PORTFOLIO_QUERY_KEYS.PERSONAL);
      expect(getMusicWorksDataQuery.key).toBe(PORTFOLIO_QUERY_KEYS.MUSIC);
    });
  });
  describe("constants contracts", () => {
    it("re-exports all portfolio constants identically from ~/services/portfolioData", () => {
      expect(PORTFOLIO_QUERY_KEYS).toEqual(CONST_PORTFOLIO_QUERY_KEYS);
      expect(PORTFOLIO_CACHE_TTL_MS).toBe(CONST_PORTFOLIO_CACHE_TTL_MS);
      expect(PROJECT_LINK_ICONS).toEqual(CONST_PROJECT_LINK_ICONS);
      expect(PORTFOLIO_CACHE_TTL_MS).toBe(60000);
      expect(PROJECT_LINK_ICONS).toEqual(["github", "external-link", "file-text"]);
    });

    it("ensures fallback structures are frozen against mutations", () => {
      expect(Object.isFrozen(NOT_FOUND_PERSONAL_INFO)).toBe(true);
      expect(Object.isFrozen(NOT_FOUND_PROJECTS)).toBe(true);
      expect(Object.isFrozen(NOT_FOUND_MUSIC_WORKS)).toBe(true);
    });
  });
});
