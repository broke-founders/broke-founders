import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { logContribution } from "@/lib/contributions"
import { transporter } from "@/lib/mailer"
import { notify } from "@/lib/notify"
import { inviteCollaborator, createBranch, pushFile, generateCodebaseMap, generateContributing } from "@/lib/github"
export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, title, slug")
    .eq("originator_id", session.id)

  if (!seeds?.length) return NextResponse.json({ requests: [] })

  const seedIds = seeds.map(s => s.id)

  const { data: requests } = await supabase
    .from("node_requests")
    .select("*, nodes(role, slice), seeds(title, slug), users(username, avatar_url, name)")
    .in("seed_id", seedIds)
    .order("created_at", { ascending: false })

  return NextResponse.json({ requests: requests || [] })
}
export async function DELETE(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { node_id } = await req.json()

  const { data: node } = await supabase
    .from("nodes")
    .select("id, role, skills_needed, seed_id, contributor_id, seeds(title, slug, originator_id)")
    .eq("id", node_id)
    .single()

  if (!node) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (node.contributor_id !== session.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Mark node vacant
  await supabase
    .from("nodes")
    .update({ status: "vacant", contributor_id: null })
    .eq("id", node_id)

  // Log contribution
  await logContribution({
    user_id: session.id,
    seed_id: node.seed_id,
    node_id: node.id,
    action: "node_dropped",
  })

  // Find matching builders from users + waitlist
  const skills = node.skills_needed || []

  const { data: matchedUsers } = await supabase
    .from("skills")
    .select("email, category, subcategory, custom_skill")
    .or(skills.map((s: string) => `subcategory.ilike.%${s}%,custom_skill.ilike.%${s}%,category.ilike.%${s}%`).join(","))
    .limit(5)

  // Email originator
  const seed = node.seeds as any
  const { data: originator } = await supabase
    .from("users")
    .select("email, username")
    .eq("id", seed?.originator_id)
    .single()

  if (originator?.email) {
    const matchList = matchedUsers?.map(u =>
      `<li style="margin-bottom:8px;font-family:Arial,sans-serif;font-size:14px;color:rgba(14,12,9,0.7);">${u.subcategory || u.custom_skill || u.category} — ${u.email}</li>`
    ).join("") || "<li>No matches found yet.</li>"

    await transporter.sendMail({
      from: `"Broke Founders" <${process.env.GMAIL_USER}>`,
      to: originator.email,
      subject: `Your ${node.role} node on "${seed?.title}" is open again`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F5F1EA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1EA;padding:60px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding:0 0 40px 0;border-bottom:1px solid rgba(14,12,9,0.08);">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(14,12,9,0.35);">Broke Founders</p>
        </td></tr>
        <tr><td style="padding:40px 0 24px 0;">
          <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:32px;font-weight:700;color:#0E0C09;line-height:1.1;">Your ${node.role} node is open again.</h1>
          <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:rgba(14,12,9,0.4);">${seed?.title}</p>
        </td></tr>
        <tr><td style="padding:0 0 24px 0;">
          <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(14,12,9,0.65);">A contributor has stepped down from this node. Here are builders from our waitlist who match the skills needed:</p>
          <ul style="margin:0;padding:0 0 0 20px;">${matchList}</ul>
        </td></tr>
        <tr><td style="padding:0 0 40px 0;">
          <a href="${process.env.NEXT_PUBLIC_URL}/seeds/${seed?.slug}" style="display:inline-block;background:#0E0C09;color:#F5F1EA;font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
            View your seed →
          </a>
        </td></tr>
        <tr><td style="border-top:1px solid rgba(14,12,9,0.08);padding:24px 0 0 0;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(14,12,9,0.3);">Broke Founders · broke-founders.vercel.app</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
  }

  return NextResponse.json({ success: true })
}
export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { request_id, action } = await req.json()

  await supabase
    .from("node_requests")
    .update({ status: action })
    .eq("id", request_id)

  const { data: request } = await supabase
    .from("node_requests")
    .select("node_id, requester_id, seed_id")
    .eq("id", request_id)
    .single()

  if (request) {
    if (action === "approved") {
      await supabase
        .from("nodes")
        .update({ status: "active", contributor_id: request.requester_id })
        .eq("id", request.node_id)

      await logContribution({
        user_id: request.requester_id,
        seed_id: request.seed_id,
        node_id: request.node_id,
        action: "node_joined",
      })

      // GitHub repo automation — fire and forget, never blocks approval
      try {
        // Fetch seed github_repo + repo_setup flag
        const { data: seed } = await supabase
          .from("seeds")
          .select("github_repo, originator_id, title, repo_setup")
          .eq("id", request.seed_id)
          .single()

        if (seed?.github_repo) {
          // Fetch originator token
          const { data: originatorUser } = await supabase
            .from("users")
            .select("github_token")
            .eq("id", seed.originator_id)
            .single()

          const originatorToken = originatorUser?.github_token

          if (originatorToken) {
            // Fetch contributor username
            const { data: contributor } = await supabase
              .from("users")
              .select("username")
              .eq("id", request.requester_id)
              .single()

            // Fetch the approved node role
            const { data: approvedNode } = await supabase
              .from("nodes")
              .select("role")
              .eq("id", request.node_id)
              .single()

            const roleBranch = `role/${(approvedNode?.role || "contributor").toLowerCase().replace(/\s+/g, "-")}`

            // Invite contributor as collaborator
            if (contributor?.username) {
              await inviteCollaborator(seed.github_repo, contributor.username, originatorToken)
            }

            // Create role branch
            await createBranch(seed.github_repo, roleBranch, originatorToken)

            // First node approval → push CONTRIBUTING.md + CODEBASE.md
            if (!seed.repo_setup) {
              const { data: allNodes } = await supabase
                .from("nodes")
                .select("role, slice, milestone")
                .eq("seed_id", request.seed_id)

              if (allNodes?.length) {
                const contributing = generateContributing(seed.title, allNodes)
                const codebaseMap = generateCodebaseMap(allNodes)

                await pushFile(seed.github_repo, "CONTRIBUTING.md", contributing, "chore: add contributing guide [broke-founders]", originatorToken)
                await pushFile(seed.github_repo, "CODEBASE.md", codebaseMap, "chore: add codebase map [broke-founders]", originatorToken)
              }

              await supabase.from("seeds").update({ repo_setup: true }).eq("id", request.seed_id)
            }
          }
        }
      } catch (ghErr) {
        console.error("[github automation]", ghErr)
      }
    }

    await notify({
      user_id: request.requester_id,
      type: action === "approved" ? "node_approved" : "node_rejected",
      title: action === "approved" ? "Your node request was approved" : "Your node request was not accepted",
      body: action === "approved" ? "You are now part of the team." : "Keep looking — another seed needs you.",
      link: `/seeds/${request.seed_id}`,
    })
  }

  return NextResponse.json({ success: true })
}

