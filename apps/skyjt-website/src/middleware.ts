import routes from "virtual:file-routes";
import { createMiddleware } from "@skyjt/typed-routes-solid";

export default [
  createMiddleware(routes),
];
