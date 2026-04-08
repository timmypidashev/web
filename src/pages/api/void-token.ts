import type { APIRoute } from "astro";

const SECRET = import.meta.env.VOID_SECRET || process.env.VOID_SECRET;

async function sign(timestamp: string): Promise<string> {
  const data = new TextEncoder().encode(timestamp + SECRET);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export const GET: APIRoute = async () => {
  if (!SECRET) {
    return new Response(JSON.stringify({ token: "dev" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const timestamp = Date.now().toString();
  const signature = await sign(timestamp);
  const token = `${timestamp}:${signature}`;

  return new Response(JSON.stringify({ token }), {
    headers: { "Content-Type": "application/json" },
  });
};
