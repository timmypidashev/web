import type { APIRoute } from "astro";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const GET: APIRoute = async () => {
  try {
    const { stdout } = await execAsync(`curl -H "Authorization: Basic ${import.meta.env.WAKATIME_API_KEY}" https://wakatime.com/api/v1/users/current/all_time_since_today`);
    
    return new Response(stdout, {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500
    });
  }
}
