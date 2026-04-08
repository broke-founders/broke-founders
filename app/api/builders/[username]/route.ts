import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

  const score = (seeds?.length || 0) * 10 + (nodes?.length || 0) * 15

  return NextResponse.json({ user, seeds: seeds || [], nodes: nodes || [], score })
}