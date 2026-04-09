import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ notifications: [] })
  const session = JSON.parse(raw)

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return NextResponse.json({ notifications: data || [] })
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", session.id)

  return NextResponse.json({ success: true })
}
