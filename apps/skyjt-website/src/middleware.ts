import { pageRoutes } from "virtual:file-routes";
import { createTypedMiddleware } from "@skyjt/typed-routes";

export default [
  createTypedMiddleware(pageRoutes),
];
