import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import UserRoute, { route } from "~/routes/(main)/user/[id]";
import { Router } from "~/router";
import { RouteValidationError } from "@skyjt/typed-routes-solid";

describe("User route: (main)/user/[id]", () => {
  it("exports defineRoute with params validator and preload function", () => {
    expect(route).toBeDefined();
    expect(route.config.params).toBeDefined();
    expect(typeof route.config.preload).toBe("function");
  });

  it("handles valid and invalid preload tuples gracefully", async () => {
    const preload = route.config.preload;
    expect(preload).toBeDefined();

    if (preload) {
      // Valid param tuple: [data, undefined]
      const validPromise = preload({
        params: [{ id: 42 }, undefined],
        search: [undefined, undefined],
        location: { key: "user-42", pathname: "/user/42", search: "", hash: "", query: {}, state: null },
      });
      expect(validPromise).toBeDefined();
      const validResult = await validPromise;
      expect(validResult?.id).toBe(42);

      // Invalid param tuple: [undefined, error]
      const err = new RouteValidationError("params", [{ message: "Expected number" }]);
      const invalidResult = await preload({
        params: [undefined, err],
        search: [undefined, undefined],
        location: { key: "user-invalid", pathname: "/user/invalid", search: "", hash: "", query: {}, state: null },
      });
      expect(invalidResult).toBeUndefined();
    }
  });

  it("renders fallback validation error when route parameters are absent or invalid", async () => {
    const { findByText } = render(() => (
      <Router>
        {() => <UserRoute />}
      </Router>
    ));
    expect(await findByText(/Invalid user ID:/i)).toBeDefined();
  });
});
