import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { logContribution } from "@/lib/contributions"
import { createHmac, timingSafeEqual } from "crypto"

function verifySignature(body: string, sig: string | null): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret || !sig) return false
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("x-hub-signature-256")
  const event = req.headers.get("x-github-event")

  if (!verifySignature(body, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  // Only handle push events
  if (event !== "push") {
    return NextResponse.json({ skipped: true })
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const repoUrl = payload?.repository?.html_url as string | undefined
  if (!repoUrl) return NextResponse.json({ error: "No repo URL" }, { status: 400 })

  // Normalise URL to match how seeds store github_repo
  const repoNormalised = repoUrl.replace(/\/$/, "").toLowerCase()

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, github_repo")
    .not("github_repo", "is", null)

  const seed = seeds?.find(s => {
    const stored = (s.github_repo as string).replace(/\/$/, "").toLowerCase()
    return stored === repoNormalised || stored === repoNormalised.replace("https://github.com/", "github.com/")
  })

  if (!seed) return NextResponse.json({ skipped: "no matching seed" })

  // Update last_activity
  await supabase
    .from("seeds")
    .update({ last_activity: new Date().toISOString() })
    .eq("id", seed.id)

  // Try to match pusher to a user in our DB
  const pusherUsername = payload?.pusher?.name as string | undefined
  if (pusherUsername) {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("github_username", pusherUsername)
      .single()

    if (user) {
      await logContribution({
        user_id: user.id,
        seed_id: seed.id,
        action: "seed_commit",
        meta: {
          commits: payload.commits?.length ?? 1,
          ref: payload.ref,
          message: payload.commits?.[0]?.message ?? "",
        },
      })
    }
  }

  return NextResponse.json({ success: true, seed_id: seed.id })
}
