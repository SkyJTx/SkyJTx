import { isServer } from "@solidjs/web";
import { useContext } from "solid-js";
import { RouterContext } from "@solidjs/router";
import { edenClient, type EdenClient } from "../eden-client";
import type { EdenServer } from "../eden-server";
import { getEdenCache } from "./cache";

export function hasRouterContext(): boolean {
  try {
    return Boolean(useContext(RouterContext));
  } catch {
    return false;
  }
}

export function formatEdenError(error: unknown): string {
  if (typeof error === "string") {
    try {
      const parsed = JSON.parse(error) as { detail?: string; message?: string };
      return parsed.detail || parsed.message || error;
    } catch {
      return error;
    }
  }
  if (typeof error === "object" && error !== null) {
    if ("value" in error && typeof error.value === "string") {
      try {
        const parsed = JSON.parse(error.value) as { detail?: string; message?: string };
        return parsed.detail || parsed.message || error.value;
      } catch {
        return error.value;
      }
    }
    if ("value" in error && typeof error.value === "object" && error.value !== null) {
      const v = error.value as { detail?: string; message?: string };
      return v.detail || v.message || JSON.stringify(error.value);
    }
    if ("detail" in error && typeof error.detail === "string") {
      return error.detail;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
}

export async function getEden(): Promise<EdenClient | EdenServer> {
  const cached = getEdenCache();
  if (cached) {
    return cached;
  }

  const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";
  if (isServer || isTest) {
    const { edenServer } = await import("../eden-server");
    return edenServer;
  }

  return edenClient;
}
