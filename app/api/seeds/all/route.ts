import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, slug, title, problem, stage, created_at, originator_stake")
    .order("created_at", { ascending: false })

  const seedsWithNodes = await Promise.all(
    (seeds || []).map(async (seed) => {
      const { count } = await supabase
        .from("nodes")
        .select("*", { count: "exact", head: true })
        .eq("seed_id", seed.id)
        .eq("status", "open")
      return { ...seed, open_nodes: count || 0 }
    })
  )

  return NextResponse.json({ seeds: seedsWithNodes })
}