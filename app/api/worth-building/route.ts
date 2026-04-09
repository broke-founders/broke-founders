import { NextResponse } from "next/server"

async function getHackerNewsShowHN() {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/showstories.json", {
      next: { revalidate: 3600 }
    })
    const ids = await res.json()
    const top = ids.slice(0, 8)
    const stories = await Promise.all(
      top.map(async (id: number) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return r.json()
      })
    )
    return stories
      .filter((s: any) => s && s.title && s.score > 10)
      .map((s: any) => ({
        title: s.title.replace(/^Show HN: /, ""),
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        points: s.score,
        comments: s.descendants || 0,
        source: "HN",
      }))
  } catch { return [] }
}

async function getGitHubTrending() {
  try {
    const res = await fetch(
      "https://api.github.com/search/repositories?q=created:>2026-03-01&sort=stars&order=desc&per_page=6",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 }
      }
    )
    const data = await res.json()
    return (data.items || []).map((r: any) => ({
      title: r.name.replace(/-/g, " "),
      url: r.html_url,
      points: r.stargazers_count,
      comments: r.forks_count,
      source: "GitHub",
      description: r.description,
      language: r.language,
    }))
  } catch { return [] }
}

export async function GET() {
  const [hn, github] = await Promise.all([
    getHackerNewsShowHN(),
    getGitHubTrending(),
  ])

  return NextResponse.json({
    hn: hn.slice(0, 5),
    github: github.slice(0, 5),
    updated: new Date().toISOString(),
  })
}