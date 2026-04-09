import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const STALE_DAYS = 14

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, title, github_repo, stage, last_activity")
    .not("github_repo", "is", null)
    .eq("stage", "sprout")

  const results = []

  for (const seed of seeds || []) {
    if (!seed.github_repo) continue

    // If webhook has recorded recent activity, use that — skip the API call
    if (seed.last_activity) {
      const daysSince = (Date.now() - new Date(seed.last_activity).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince > STALE_DAYS) {
        await supabase.from("seeds").update({ stage: "fossil" }).eq("id", seed.id)
        results.push({ seed: seed.id, status: "fossilized", daysSince, source: "last_activity" })
      } else {
        results.push({ seed: seed.id, status: "active", daysSince, source: "last_activity" })
      }
      continue
    }

    // No webhook data yet — fall back to GitHub API
    const repoPath = seed.github_repo
      .replace("https://github.com/", "")
      .replace("github.com/", "")
      .replace(/\/$/, "")

    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=1`, { headers })

      if (!res.ok) {
        results.push({ seed: seed.id, status: "fetch_failed", source: "github_api" })
        continue
      }

      const commits = await res.json()
      if (!commits?.length) {
        results.push({ seed: seed.id, status: "no_commits", source: "github_api" })
        continue
      }

      const lastCommitDate = new Date(commits[0].commit.committer.date)
      const daysSince = (Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)

      // Backfill last_activity from the API result
      await supabase
        .from("seeds")
        .update({ last_activity: lastCommitDate.toISOString() })
        .eq("id", seed.id)

      if (daysSince > STALE_DAYS) {
        await supabase.from("seeds").update({ stage: "fossil" }).eq("id", seed.id)
        results.push({ seed: seed.id, status: "fossilized", daysSince, source: "github_api" })
      } else {
        results.push({ seed: seed.id, status: "active", daysSince, source: "github_api" })
      }
    } catch {
      results.push({ seed: seed.id, status: "error", source: "github_api" })
    }
  }

  return NextResponse.json({ checked: results.length, results })
}
