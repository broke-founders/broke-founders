import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { searchParams } = new URL(req.url)
  const seed_id = searchParams.get("seed_id")
  if (!seed_id) return NextResponse.json({ error: "Missing seed_id" }, { status: 400 })

  const { data: seed } = await supabase
    .from("seeds")
    .select("paid, payment_method")
    .eq("id", seed_id)
    .eq("originator_id", session.id)
    .single()

  return NextResponse.json({
    paid: seed?.paid ?? false,
    payment_method: seed?.payment_method ?? null,
  })
}
