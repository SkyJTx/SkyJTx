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
    </>
  );
}
