import { pageRoutes } from "virtual:file-routes";
import { createMiddleware } from "@skyjt/typed-routes";

export default [
  createMiddleware(pageRoutes),
];
