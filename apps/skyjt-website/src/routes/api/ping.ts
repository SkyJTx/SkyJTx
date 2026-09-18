export async function GET(event: { request: Request }) {
  const url = new URL(event.request.url);

  return new Response(
    JSON.stringify({
      status: "active",
      timestamp: Date.now(),
      path: url.pathname
    }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
