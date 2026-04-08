import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const seedId = searchParams.get("seed_id")

  const query = supabase
    .from("messages")
    .select("*, users(username, avatar_url, name)")
    .order("created_at", { ascending: true })
    .limit(100)

  if (seedId) {
    query.eq("seed_id", seedId)
  } else {
    query.is("seed_id", null)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data || [] })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { content, seed_id } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 })

  const { data, error } = await supabase
    .from("messages")
    .insert({
      user_id: session.id,
      seed_id: seed_id || null,
      content: content.trim(),
    })
    .select("*, users(username, avatar_url, name)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: data })
}