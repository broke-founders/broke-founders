
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=no_code`)
  }

  // Exchange code for token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  if (!accessToken) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=no_token`)
  }

  // Get GitHub user
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const githubUser = await userRes.json()

  // Get email if not public
  let email = githubUser.email
  if (!email) {
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const emails = await emailRes.json()
    email = emails.find((e: any) => e.primary)?.email || null
  }

  // Upsert user in Supabase
  const { data: user } = await supabase
    .from("users")
    .upsert({
      github_id: String(githubUser.id),
      github_username: githubUser.login,
      github_avatar: githubUser.avatar_url,
      email,
      name: githubUser.name || githubUser.login,
    }, { onConflict: "github_id" })
    .select()
    .single()

  // Set session cookie
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/dashboard`)
  response.cookies.set("bf_user", JSON.stringify({
    id: user?.id,
    github_username: githubUser.login,
    github_avatar: githubUser.avatar_url,
    name: githubUser.name || githubUser.login,
    email,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })

  return response
}