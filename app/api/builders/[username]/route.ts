import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getUserScore, getLevel } from "@/lib/contributions"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const { data: user } = await supabase
    .from("users")
    .select("id, username, name, avatar_url, created_at")
    .eq("username", username)
    .single()

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, slug, title, stage, created_at")
    .eq("originator_id", user.id)
    .order("created_at", { ascending: false })

  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, role, slice, status, seeds(title, slug)")
    .eq("contributor_id", user.id)
    .eq("status", "active")

  const { data: contributions } = await supabase
    .from("contributions")
    .select("id, action, points, created_at, meta, seeds(title, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const { data: achievements } = await supabase
    .from("achievements")
    .select("achievement, earned_at")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })

  const score = await getUserScore(user.id)
  const level = getLevel(score)

  return NextResponse.json({
    user,
    seeds: seeds || [],
    nodes: nodes || [],
    contributions: contributions || [],
    achievements: achievements || [],
    score,
    level,
  })
}