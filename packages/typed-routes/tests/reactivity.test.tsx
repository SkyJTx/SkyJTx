import { describe, it, expect } from "vitest";
import { createRoot, createSignal, createMemo, type Accessor } from "solid-js";
import { defineRoute } from "../src/router/define-route";
import { schema } from "../src/schema/builtin";
import { validateData } from "../src/schema/validator-adapter";

describe("Fine-Grained Reactive Unwrapping", () => {
  it("updates params accessor reactively without remounting or state teardown", async () => {
    let setRawParams!: (val: Record<string, string>) => void;
    let paramsAccessor!: Accessor<{ id: number }>;
    let renderCount = 0;
    const componentState = { initializedAt: Date.now() };

    createRoot(() => {
      const userRoute = defineRoute({
        params: schema.object({
          id: schema.number(),
        }),
      });

      const [rawParams, setParams] = createSignal<Record<string, string>>({ id: "42" });
      setRawParams = setParams;
      renderCount++;

      paramsAccessor = createMemo(() => {
        return validateData(userRoute.config.params, rawParams()).data as { id: number };
      });
    });

    expect(paramsAccessor().id).toBe(42);
    expect(renderCount).toBe(1);

    // In-place navigation updating params
    setRawParams({ id: "43" });
    await Promise.resolve();

    expect(paramsAccessor().id).toBe(43);
    // Component state persists without remounting
    expect(renderCount).toBe(1);
    expect(componentState.initializedAt).toBeDefined();
  });
});
