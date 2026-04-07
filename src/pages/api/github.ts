import type { APIRoute } from "astro";

const GITHUB_USER = "timmypidashev";

export const GET: APIRoute = async () => {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "timmypidashev-web",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let status: { message: string } | null = null;
  let commit: { message: string; repo: string; date: string; url: string } | null = null;
  let tinkering: { repo: string; url: string } | null = null;

  // Fetch user status via GraphQL (requires token)
  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{ user(login: "${GITHUB_USER}") { status { message } } }`,
        }),
      });
      const data = await res.json();
      const s = data?.data?.user?.status;
      if (s?.message) {
        status = { message: s.message };
      }
    } catch {
      // Status unavailable — skip
    }
  }

  // Fetch latest public push event, then fetch commit details
  try {
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`,
      { headers },
    );
    const events = await eventsRes.json();
    // Find most active repo from recent push events
    if (Array.isArray(events)) {
      const repoCounts: Record<string, number> = {};
      for (const e of events) {
        if (e.type === "PushEvent") {
          const name = e.repo.name.replace(`${GITHUB_USER}/`, "");
          repoCounts[name] = (repoCounts[name] || 0) + 1;
        }
      }
      const topRepo = Object.entries(repoCounts).sort((a, b) => b[1] - a[1])[0];
      if (topRepo) {
        tinkering = {
          repo: topRepo[0],
          url: `https://github.com/${GITHUB_USER}/${topRepo[0]}`,
        };
      }
    }

    const push = Array.isArray(events)
      ? events.find((e: any) => e.type === "PushEvent")
      : null;
    if (push) {
      const repo = push.repo.name.replace(`${GITHUB_USER}/`, "");
      const sha = push.payload?.head;
      if (sha) {
        const commitRes = await fetch(
          `https://api.github.com/repos/${GITHUB_USER}/${repo}/commits/${sha}`,
          { headers },
        );
        const commitData = await commitRes.json();
        if (commitData?.commit?.message) {
          commit = {
            message: commitData.commit.message.split("\n")[0],
            repo,
            date: push.created_at,
            url: commitData.html_url,
          };
        }
      }
    }
  } catch {
    // Commit unavailable — skip
  }

  return new Response(JSON.stringify({ status, commit, tinkering }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
};
