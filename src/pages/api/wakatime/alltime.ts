import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const WAKATIME_API_KEY = import.meta.env.WAKATIME_API_KEY;

  if (!WAKATIME_API_KEY) {
    return new Response(
      JSON.stringify({ error: "WAKATIME_API_KEY not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      "https://wakatime.com/api/v1/users/current/all_time_since_today",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}`,
        },
      }
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("WakaTime alltime API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
