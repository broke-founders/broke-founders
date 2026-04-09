import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, role, slice, status, seeds(title, slug)")
    .eq("contributor_id", session.id)
    .eq("status", "active")

  return NextResponse.json({ nodes: nodes || [] })
}