import { Title } from "@solidjs/meta";
import { useSignal } from "@skyjtx/signals-solid";

export default function Home() {
  const count = useSignal(0);

  return (
    <>
      <Title>Solid Start</Title>
      <h1>Welcome to Solid Start!</h1>
      <button onClick={() => (count.value += 1)}>Count: {count.value}</button>
      <p>You have clicked the button {count.value} times.</p>

      <h2>Packages</h2>
      <ul>
        <li>
          <a href="/packages/query-solid">Query Solid Demo</a>
        </li>
        <li>
          <a href="/packages/store-solid">Store Solid Demo</a>
        </li>
        <li>
          <a href="/packages/signals-solid">Signals Solid Demo</a>
        </li>
      </ul>
    </>
  );
}
