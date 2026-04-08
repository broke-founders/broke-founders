import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getSession } from "@/lib/session"
import { cookies } from "next/headers"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { title, problem, originator_stake, graduation_threshold, github_repo, nodes } = await req.json()

  if (!title || !problem || !originator_stake || !nodes?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const totalNodeSlices = nodes.reduce((sum: number, n: any) => sum + n.slice, 0)
  if (originator_stake + totalNodeSlices !== 100) {
    return NextResponse.json({ error: "Slices must total 100" }, { status: 400 })
  }

  const slug = slugify(title) + "-" + Date.now().toString(36)

  const { data: seed, error: seedError } = await supabase
    .from("seeds")
    .insert({
      slug,
      title,
      problem,
      originator_id: session.id,
      originator_stake,
      graduation_threshold,
      github_repo,
    })
    .select()
    .single()

  if (seedError) return NextResponse.json({ error: seedError.message }, { status: 500 })

  const nodeRows = nodes.map((n: any) => ({
    seed_id: seed.id,
    role: n.role,
    description: n.description,
    skills_needed: n.skills_needed,
    slice: n.slice,
    hours_estimate: n.hours_estimate,
    milestone: n.milestone,
  }))

  await supabase.from("nodes").insert(nodeRows)

  return NextResponse.json({ success: true, slug: seed.slug })
}