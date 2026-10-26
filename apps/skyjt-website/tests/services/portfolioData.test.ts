import { describe, it, expect, vi, beforeEach } from "vitest";
import * as v from "valibot";
import {
  fetchWorksData,
  fetchPersonalInfo,
  fetchMusicWorksData,
  getWorksDataQuery,
  getPersonalInfoQuery,
  getMusicWorksDataQuery,
  clearPortfolioCache,
  setFetcherForTesting,
  WorksDataSchema,
  MusicWorksDataSchema,
  PersonalInfoSchema,
  STORAGE_BASE_URL,
  WORKS_DATA_URL,
  PERSONAL_INFO_URL,
  MUSIC_WORKS_DATA_URL,
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
  STORAGE_BASE_URL as CONST_STORAGE_BASE_URL,
  WORKS_DATA_URL as CONST_WORKS_DATA_URL,
  PERSONAL_INFO_URL as CONST_PERSONAL_INFO_URL,
  MUSIC_WORKS_DATA_URL as CONST_MUSIC_WORKS_DATA_URL,
} from "~/constants";
import type { ProjectData, MusicWorkData } from "~/types";

describe("portfolioData service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearPortfolioCache();
    setFetcherForTesting(null);
  });

  describe("schema validation", () => {
    it("validates valid works data structure", () => {
      const mockProjects: ProjectData[] = [
        {
          id: "test-id",
          title: "Test Project",
          description: "Test description",
          thumbnailUrl: "https://example.com/thumb.jpg",
          images: [{ src: "https://example.com/img.jpg", alt: "alt" }],
          links: [{ label: "GitHub", url: "https://github.com", icon: "github" }],
        },
      ];

      const result = v.safeParse(WorksDataSchema, mockProjects);
      expect(result.success).toBe(true);
    });

    it("rejects invalid works data structure", () => {
      const invalidProjects = [{ id: 123, title: 456 }];
      const result = v.safeParse(WorksDataSchema, invalidProjects);
      expect(result.success).toBe(false);
    });

    it("validates valid music works data structure", () => {
      const mockScores: MusicWorkData[] = [
        {
          id: "score-1",
          title: "BWV 1067",
          scoreUrl: "https://musescore.com/score/1",
          thumbnailUrl: "https://example.com/score.png",
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
          description: "Fetched from Storage",
          thumbnailUrl: "https://example.com/p1.jpg",
          images: [],
          links: [],
        },
      ];

      setFetcherForTesting(async (type) => {
        if (type === "works") return mockProjects;
        throw new Error("Not Found");
      });

      const [data, error] = await fetchWorksData();
      expect(error).toBeUndefined();
      expect(data).toHaveLength(1);
      expect(data?.[0]?.id).toBe("remote-p1");
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

      let callCount = 0;
      setFetcherForTesting(async () => {
        callCount++;
        return mockProjects;
      });

      const [data1, error1] = await fetchWorksData();
      const [data2, error2] = await fetchWorksData();

      expect(callCount).toBe(1);
      expect(error1).toBeUndefined();
      expect(error2).toBeUndefined();
      expect(data1).toEqual(data2);
    });

    it("returns scoped error when fetch fails instead of throwing unhandled exception", async () => {
      setFetcherForTesting(async () => {
        throw new Error("Failed to fetch works data: Not Found");
      });

      const [data, error] = await fetchWorksData();
      expect(data).toBeUndefined();
      expect(error).toBeDefined();
      expect(error?.message).toContain("Failed to fetch works data");
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

      setFetcherForTesting(async (type) => {
        if (type === "music") return mockScores;
        throw new Error("Not Found");
      });

      const [data, error] = await fetchMusicWorksData();
      expect(error).toBeUndefined();
      expect(data).toHaveLength(1);
      expect(data?.[0]?.id).toBe("score-1");
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

      let callCount = 0;
      setFetcherForTesting(async () => {
        callCount++;
        return mockScores;
      });

      const [data1, error1] = await fetchMusicWorksData();
      const [data2, error2] = await fetchMusicWorksData();

      expect(callCount).toBe(1);
      expect(error1).toBeUndefined();
      expect(error2).toBeUndefined();
      expect(data1).toEqual(data2);
    });

    it("returns scoped error when music fetch fails instead of throwing unhandled exception", async () => {
      setFetcherForTesting(async () => {
        throw new Error("Failed to fetch music works data: Not Found");
      });

      const [data, error] = await fetchMusicWorksData();
      expect(data).toBeUndefined();
      expect(error).toBeDefined();
      expect(error?.message).toContain("Failed to fetch music works data");
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
        resumeUrl: "/api/storage/file/cv.pdf",
        myselfPhotoUrl: "/api/storage/file/me.jpg",
      };

      setFetcherForTesting(async (type) => {
        if (type === "personal") return mockInfo;
        throw new Error("Not Found");
      });

      const [data, error] = await fetchPersonalInfo();
      expect(error).toBeUndefined();
      expect(data?.fullName).toBe("Jane Doe");
      expect(data?.location).toBe("Tokyo, Japan");
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
        resumeUrl: "/api/storage/file/cv.pdf",
        myselfPhotoUrl: "/api/storage/file/me.jpg",
      };

      let callCount = 0;
      setFetcherForTesting(async () => {
        callCount++;
        return mockInfo;
      });

      const [data1, error1] = await fetchPersonalInfo();
      const [data2, error2] = await fetchPersonalInfo();

      expect(callCount).toBe(1);
      expect(error1).toBeUndefined();
      expect(error2).toBeUndefined();
      expect(data1).toEqual(data2);
    });

    it("returns scoped error on personal info fetch failure instead of throwing unhandled exception", async () => {
      setFetcherForTesting(async () => {
        throw new Error("Failed to fetch personal info: Internal Server Error");
      });

      const [data, error] = await fetchPersonalInfo();
      expect(data).toBeUndefined();
      expect(error).toBeDefined();
      expect(error?.message).toContain("Failed to fetch personal info");
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
      expect(STORAGE_BASE_URL).toBe(CONST_STORAGE_BASE_URL);
      expect(WORKS_DATA_URL).toBe(CONST_WORKS_DATA_URL);
      expect(PERSONAL_INFO_URL).toBe(CONST_PERSONAL_INFO_URL);
      expect(MUSIC_WORKS_DATA_URL).toBe(CONST_MUSIC_WORKS_DATA_URL);
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