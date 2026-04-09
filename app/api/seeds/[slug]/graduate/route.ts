import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { logContribution } from "@/lib/contributions"
import { transporter } from "@/lib/mailer"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { data: seed } = await supabase
    .from("seeds")
    .select("id, title, problem, slug, stage, originator_id, originator_stake, graduation_threshold")
    .eq("slug", slug)
    .single()

  if (!seed) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (seed.originator_id !== session.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  if (!["sprout", "shoot"].includes(seed.stage)) {
    return NextResponse.json({ error: "Seed is not in a graduatable stage" }, { status: 400 })
  }

  // Update stage to grove
  await supabase.from("seeds").update({ stage: "grove" }).eq("id", seed.id)

  // Get all active nodes with contributor info
  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, role, slice, milestone, contributor_id")
    .eq("seed_id", seed.id)
    .eq("status", "active")

  // Collect all team member IDs (originator + contributors)
  const contributorIds = (nodes || [])
    .map(n => n.contributor_id)
    .filter(Boolean) as string[]

  const allMemberIds = [...new Set([seed.originator_id, ...contributorIds])]

  // Fetch all member emails + usernames
  const { data: members } = await supabase
    .from("users")
    .select("id, email, username, avatar_url")
    .in("id", allMemberIds)

  const memberMap = Object.fromEntries((members || []).map(m => [m.id, m]))

  // Log seed_graduated contribution for everyone
  for (const memberId of allMemberIds) {
    await logContribution({
      user_id: memberId,
      seed_id: seed.id,
      action: "seed_graduated",
      meta: { title: seed.title },
    })
  }

  // Build node rows for email
  const nodeRows = (nodes || []).map(n => {
    const contributor = n.contributor_id ? memberMap[n.contributor_id] : null
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="font-family:Georgia,serif;font-size:15px;font-weight:700;color:#F5F1EA;">${n.role}</span>
          ${contributor ? `<span style="font-family:Arial,sans-serif;font-size:12px;color:rgba(245,241,234,0.45);margin-left:10px;">@${contributor.username}</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">
          <span style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#C0392B;">${n.slice}%</span>
        </td>
      </tr>`
  }).join("")

  // Send congratulations email to each team member
  for (const member of members || []) {
    if (!member.email) continue

    const nodeForMember = (nodes || []).find(n => n.contributor_id === member.id)
    const role = member.id === seed.originator_id
      ? `Originator · ${seed.originator_stake}% equity`
      : nodeForMember
        ? `${nodeForMember.role} · ${nodeForMember.slice}% equity`
        : "Team member"

    await transporter.sendMail({
      from: `"Broke Founders" <${process.env.GMAIL_USER}>`,
      to: member.email,
      subject: `${seed.title} has graduated 🌿`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0E0C09;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0C09;padding:60px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 0 40px 0;border-bottom:1px solid rgba(245,241,234,0.08);">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,241,234,0.25);">Broke Founders</p>
        </td></tr>

        <!-- Badge -->
        <tr><td style="padding:48px 0 0 0;">
          <p style="margin:0 0 20px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;font-weight:700;color:#C0392B;">Graduated</p>
        </td></tr>

        <!-- Title -->
        <tr><td style="padding:0 0 16px 0;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:clamp(36px,8vw,52px);font-weight:900;color:#F5F1EA;line-height:1.0;letter-spacing:-0.03em;">${seed.title}</h1>
        </td></tr>

        <!-- Subtitle -->
        <tr><td style="padding:0 0 48px 0;border-bottom:1px solid rgba(245,241,234,0.08);">
          <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:rgba(245,241,234,0.35);line-height:1.6;">This seed has reached the grove.</p>
        </td></tr>

        <!-- Your role -->
        <tr><td style="padding:40px 0 0 0;">
          <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,241,234,0.35);font-weight:600;">Your role</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#F5F1EA;">${role}</p>
        </td></tr>

        <!-- What was built -->
        <tr><td style="padding:32px 0 0 0;">
          <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,241,234,0.35);font-weight:600;">What was built</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.85;color:rgba(245,241,234,0.6);">${seed.problem.split("\n")[0]}</p>
        </td></tr>

        ${seed.graduation_threshold ? `
        <!-- Graduation threshold -->
        <tr><td style="padding:32px 0 0 0;">
          <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,241,234,0.35);font-weight:600;">Graduated when</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-weight:700;color:#F5F1EA;">${seed.graduation_threshold}</p>
        </td></tr>` : ""}

        <!-- Team table -->
        <tr><td style="padding:40px 0 0 0;">
          <p style="margin:0 0 20px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,241,234,0.35);font-weight:600;">The team</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="font-family:Georgia,serif;font-size:15px;font-weight:700;color:#F5F1EA;">Originator</span>
                <span style="font-family:Arial,sans-serif;font-size:12px;color:rgba(245,241,234,0.45);margin-left:10px;">@${memberMap[seed.originator_id]?.username || ""}</span>
              </td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">
                <span style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#C0392B;">${seed.originator_stake}%</span>
              </td>
            </tr>
            ${nodeRows}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:48px 0 40px 0;">
          <a href="${process.env.NEXT_PUBLIC_URL}/seeds/${seed.slug}/graduated"
             style="display:inline-block;background:#F5F1EA;color:#0E0C09;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:16px 32px;">
            View graduation page →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="border-top:1px solid rgba(245,241,234,0.08);padding:28px 0 0 0;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,241,234,0.2);">Broke Founders · broke-founders.vercel.app</p>
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
