import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, title, slug")
    .eq("originator_id", session.id)

  if (!seeds?.length) return NextResponse.json({ requests: [] })

  const seedIds = seeds.map(s => s.id)

  const { data: requests } = await supabase
    .from("node_requests")
    .select("*, nodes(role, slice), seeds(title, slug), users(username, avatar_url, name)")
    .in("seed_id", seedIds)
    .order("created_at", { ascending: false })

  return NextResponse.json({ requests: requests || [] })
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { request_id, action } = await req.json()

  await supabase
    .from("node_requests")
    .update({ status: action })
    .eq("id", request_id)

  if (action === "approved") {
    const { data: request } = await supabase
      .from("node_requests")
      .select("node_id, requester_id")
      .eq("id", request_id)
      .single()

    if (request) {
      await supabase
        .from("nodes")
        .update({ status: "active", contributor_id: request.requester_id })
        .eq("id", request.node_id)
    }
  }

  return NextResponse.json({ success: true })
}