import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) || []
  if (!ids.length) return NextResponse.json({ users: {} })

  const { data } = await supabase
    .from("users")
    .select("id, username, avatar_url, name")
    .in("id", ids)

  const users = Object.fromEntries((data || []).map(u => [u.id, u]))
  return NextResponse.json({ users })
}
