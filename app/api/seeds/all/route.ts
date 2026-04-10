import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const skill = searchParams.get("skill") || ""
  const sort = searchParams.get("sort") || "newest"

  let query = supabase
    .from("seeds")
    .select("id, slug, title, problem, stage, created_at, originator_stake, last_activity")

  if (sort === "activity") {
    query = query.order("last_activity", { ascending: false, nullsFirst: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: seeds } = await query

  const seedsWithNodes = await Promise.all(
    (seeds || []).map(async (seed) => {
      const nodesQuery = supabase
        .from("nodes")
        .select("id, skills_needed, status")
        .eq("seed_id", seed.id)

      const { data: nodes } = await nodesQuery

      const open_nodes = (nodes || []).filter(n => n.status === "open").length

      // Skill filter: check if any node's skills_needed includes the skill
      if (skill) {
        const skillLower = skill.toLowerCase()
        const matches = (nodes || []).some(n =>
          Array.isArray(n.skills_needed) &&
          n.skills_needed.some((s: string) => s.toLowerCase().includes(skillLower))
        )
        if (!matches) return null
      }

      return { ...seed, open_nodes }
    })
  )

  const filtered = seedsWithNodes.filter(Boolean)

  // Sort by open nodes if requested (after fetching counts)
  if (sort === "open_nodes") {
    filtered.sort((a: any, b: any) => (b.open_nodes ?? 0) - (a.open_nodes ?? 0))
  }

  return NextResponse.json({ seeds: filtered })
}
