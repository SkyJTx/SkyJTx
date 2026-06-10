import { Title } from "@solidjs/meta";
import { useSolidMutation, useSolidQuery } from "@skyjt/query-solid";
import { action, useAction } from "@solidjs/router";

const delayedServerIncrement = action(async (newValue: number) => {
  "use server";
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(1000);
  console.log("Server incremented value:", newValue);
  return newValue + 1;
});

export default function Home() {
  const query = useSolidQuery({
    queryKey: "count",
    async queryFn() {
      return 0;
    },
    initialData: 0,
  });

  const incrementAction = useAction(delayedServerIncrement);

  const mutation = useSolidMutation({
    mutationFn: async (newValue: number) => {
      return await incrementAction(newValue);
    },
    onSuccess(data) {
      query.mutate(data);
      console.log("Client updated value:", data);
    },
  });

  return (
    <>
      <Title>Solid Start</Title>
      <h1>Welcome to Solid Start!</h1>
      <button
        disabled={mutation.isPending}
        onClick={() => {
          mutation.mutate(query.data);
        }}
      >
        {mutation.isPending ? "Incrementing..." : "Increment"}
      </button>
      <p>You have clicked the button {query.data} times.</p>
      <hr></hr>
      <h2>Code</h2>
      <pre>
        {`
import { Title } from "@solidjs/meta";
import { useSolidMutation, useSolidQuery } from "@skyjt/query-solid";
import { action, useAction } from "@solidjs/router";

const delayedServerIncrement = action(async (newValue: number) => {
  "use server";
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(1000);
  console.log("Server incremented value:", newValue);
  return newValue + 1;
});

export default function Home() {
  const query = useSolidQuery({
    queryKey: "count",
    async queryFn() {
      return 0;
    },
    initialData: 0,
  });

  const incrementAction = useAction(delayedServerIncrement);

  const mutation = useSolidMutation({
    mutationFn: async (newValue: number) => {
      return await incrementAction(newValue);
    },
    onSuccess(data) {
      query.mutate(data);
      console.log("Client updated value:", data);
    },
  });

  return (
    <>
      <Title>Solid Start</Title>
      <h1>Welcome to Solid Start!</h1>
      <button
        disabled={mutation.isPending}
        onClick={() => {
          mutation.mutate(query.data);
        }}
      >
        {mutation.isPending ? "Incrementing..." : "Increment"}
      </button>
      <p>You have clicked the button {query.data} times.</p>
    </>
  );
}

`}
      </pre>
    </>
  );
}
