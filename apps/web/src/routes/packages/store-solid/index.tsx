import { useComputed, useSignal } from "@skyjt/signals-solid";
import { defineStore } from "@skyjt/store-solid";
import { Title } from "@solidjs/meta";

const useSolidStore = defineStore("test", () => {
  const [count, setCount] = useSignal(0);
  const double = useComputed(() => count() * 2);

  return {
    count,
    setCount,
    double
  }
});

export default function StoreSolidPage() {
  const {count, setCount, double} = useSolidStore();
  return (
    <>
      <> {/* <>For Head</> */}
        <Title>StoreSolidPage</Title>
      </>
      <> {/* <>For Body</> */}
        <h1>StoreSolidPage</h1>
        <p>Count: {count()}</p>
        <p>Double: {double()}</p>
        <button type="button" onClick={() => setCount(count() + 1)}>Increment</button>
        <button type="button" onClick={() => setCount(count() - 1)}>Decrement</button>
      </>
    </>
  );
}