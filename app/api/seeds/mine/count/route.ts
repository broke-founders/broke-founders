import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { count } = await supabase
    .from("seeds")
    .select("id", { count: "exact", head: true })
    .eq("originator_id", session.id)

  return NextResponse.json({ count: count ?? 0 })
}
