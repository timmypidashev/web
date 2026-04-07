import type { APIRoute } from "astro";
import { incrementViews, getViews } from "@/lib/views";

const SLUG = "hero-arc";

export const POST: APIRoute = async () => {
  const count = import.meta.env.DEV
    ? await getViews(SLUG)
    : await incrementViews(SLUG);

  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
};
