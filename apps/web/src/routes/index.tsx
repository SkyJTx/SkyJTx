import { Title } from "@solidjs/meta";
import { useSolidQuery } from "@skyjtx/query-solid";

export default function Home() {
  const query = useSolidQuery({
    queryKey: "count",
    queryFn: async () => {
      return 0;
    },
    initialData: 0,
  });

  return (
    <>
      <Title>Solid Start</Title>
      <h1>Welcome to Solid Start!</h1>
      <button
        onClick={() => {
          query.mutate(query.data + 1);
        }}
      >
        Count: {query.data}
      </button>
      <p>You have clicked the button {query.data} times.</p>
    </>
  );
}
