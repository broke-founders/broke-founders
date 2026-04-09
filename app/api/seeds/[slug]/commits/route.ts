import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: seed } = await supabase
    .from("seeds")
    .select("id")
    .eq("slug", slug)
    .single()

  if (!seed) return NextResponse.json({ commits: [] })

  const { data: contribs } = await supabase
    .from("contributions")
    .select("id, created_at, meta, users(username, avatar_url)")
    .eq("seed_id", seed.id)
    .eq("action", "seed_commit")
    .order("created_at", { ascending: false })
    .limit(20)

  return NextResponse.json({ commits: contribs || [] })
}
