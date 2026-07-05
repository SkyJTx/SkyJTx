import { mock } from "bun:test";

mock.module("solid-js", () => import("solid-js/dist/solid.js"));
mock.module("solid-js/store", () => import("solid-js/store/dist/store.js"));
