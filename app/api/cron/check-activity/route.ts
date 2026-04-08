import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, title, github_repo, stage")
    .not("github_repo", "is", null)
    .eq("stage", "sprout")

  const results = []

  for (const seed of seeds || []) {
    if (!seed.github_repo) continue

    const repoPath = seed.github_repo
      .replace("https://github.com/", "")
      .replace("github.com/", "")
      .replace(/\/$/, "")

    try {
      const res = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=1`, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })

      if (!res.ok) {
        results.push({ seed: seed.id, status: "fetch_failed" })
        continue
      }

      const commits = await res.json()
      if (!commits?.length) {
        results.push({ seed: seed.id, status: "no_commits" })
        continue
      }

      const lastCommitDate = new Date(commits[0].commit.committer.date)
      const daysSince = (Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysSince > 14) {
        await supabase
          .from("seeds")
          .update({ stage: "fossil" })
          .eq("id", seed.id)
        results.push({ seed: seed.id, status: "fossilized", daysSince })
      } else {
        results.push({ seed: seed.id, status: "active", daysSince })
      }
    } catch (err) {
      results.push({ seed: seed.id, status: "error" })
    }
  }

  return NextResponse.json({ checked: results.length, results })
}