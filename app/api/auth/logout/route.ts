import { NextResponse } from "next/server"

export async function GET() {
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/`)
  response.cookies.delete("bf_user")
  return response
}