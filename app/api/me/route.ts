import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ user: null })
  try {
    return NextResponse.json({ user: JSON.parse(raw) })
  } catch {
    return NextResponse.json({ user: null })
  }
}
