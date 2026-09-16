import { pageRoutes } from "virtual:file-routes";
import { createTypedRouter, interceptFileRoutes } from "@skyjt/typed-routes";

export const {
  Router,
  TypedLink,
  useTypedNavigate,
  paths,
  routes,
} = createTypedRouter<typeof pageRoutes>({
  routes: interceptFileRoutes(pageRoutes),
});
