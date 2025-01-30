// src/pages/api/wakatime/detailed.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const WAKATIME_API_KEY = import.meta.env.WAKATIME_API_KEY;
  
  try {
    const response = await fetch(
      'https://wakatime.com/api/v1/users/current/stats/last_7_days?timeout=15', {
        headers: {
          'Authorization': `Basic ${Buffer.from(WAKATIME_API_KEY).toString('base64')}`
        }
      }
    );

    const data = await response.json();
    return new Response(
      JSON.stringify({ data: data.data }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch WakaTime data' }),
      { status: 500 }
    );
  }
}
