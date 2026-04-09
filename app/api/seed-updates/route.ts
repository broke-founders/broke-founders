import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const seedId = searchParams.get("seed_id")
  if (!seedId) return NextResponse.json({ updates: [] })

  const { data } = await supabase
    .from("seed_updates")
    .select("*, users(username, avatar_url)")
    .eq("seed_id", seedId)
    .order("created_at", { ascending: false })

  return NextResponse.json({ updates: data || [] })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { seed_id, content } = await req.json()
  if (!seed_id || !content?.trim()) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const { data } = await supabase
    .from("seed_updates")
    .insert({ seed_id, user_id: session.id, content: content.trim() })
    .select("*, users(username, avatar_url)")
    .single()

  return NextResponse.json({ update: data })
}
