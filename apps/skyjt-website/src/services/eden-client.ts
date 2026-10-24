import { treaty } from "@elysiajs/eden";
import type { AppType } from "~/server";

/**
 * Derives the base URL for client-side API requests.
 */
export function getClientBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

/**
 * Pure client-side Eden Treaty instance.
 * Decoupled from server modules to guarantee zero bundle bloat and runtime safety.
 */
export const edenClient = treaty<AppType>(getClientBaseUrl());
export type EdenClient = typeof edenClient;
