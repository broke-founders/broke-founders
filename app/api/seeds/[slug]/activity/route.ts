import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: seed } = await supabase
    .from("seeds")
    .select("github_repo")
    .eq("slug", slug)
    .single()

  if (!seed?.github_repo) {
    return NextResponse.json({ commits: [] })
  }

  const repoPath = (seed.github_repo as string)
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
    const res = await fetch(
      `https://api.github.com/repos/${repoPath}/commits?per_page=10`,
      { headers, next: { revalidate: 300 } }
    )

    if (!res.ok) return NextResponse.json({ commits: [] })

    const raw = await res.json()

    const commits = (raw as any[]).map(c => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0],
      author: c.commit.author.name,
      date: c.commit.author.date,
      url: c.html_url,
    }))

    return NextResponse.json({ commits })
  } catch {
    return NextResponse.json({ commits: [] })
  }
}
