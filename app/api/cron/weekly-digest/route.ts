import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { transporter } from "@/lib/mailer"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Platform stats for this week
  const [{ count: newSeeds }, { count: newNodes }, { count: newBuilders }] = await Promise.all([
    supabase.from("seeds").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("nodes").select("*", { count: "exact", head: true }).eq("status", "active").gte("created_at", weekAgo),
    supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
  ])

  // Recent seeds with open nodes (for the "seeds that need skills" section)
  const { data: recentSeeds } = await supabase
    .from("seeds")
    .select("id, slug, title, problem")
    .order("created_at", { ascending: false })
    .limit(50)

  const seedsWithOpen = await Promise.all(
    (recentSeeds || []).map(async (s) => {
      const { data: nodes } = await supabase
        .from("nodes")
        .select("role, slice, skills_needed")
        .eq("seed_id", s.id)
        .eq("status", "open")
        .limit(3)
      return { ...s, openNodes: nodes || [] }
    })
  )
  const seedsNeedingBuilders = seedsWithOpen.filter(s => s.openNodes.length > 0).slice(0, 5)

  // Fetch all users who haven't unsubscribed
  const { data: users } = await supabase
    .from("users")
    .select("id, email, username, name")
    .eq("unsubscribe_digest", false)
    .not("email", "is", null)

  if (!users?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  let failed = 0

  for (const user of users) {
    if (!user.email) continue

    // This week's activity for this user
    const { data: myActivity } = await supabase
      .from("contributions")
      .select("action, created_at, seeds(title, slug)")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo)
      .order("created_at", { ascending: false })
      .limit(5)

    // Seeds matching user's skills
    const { data: userSkills } = await supabase
      .from("skills")
      .select("category, subcategory, custom_skill")
      .eq("email", user.email)
      .limit(3)

    const skillTerms = (userSkills || []).map(s => s.subcategory || s.custom_skill || s.category).filter(Boolean)

    let matchedSeeds = seedsNeedingBuilders
    if (skillTerms.length) {
      matchedSeeds = seedsNeedingBuilders.filter(s =>
        s.openNodes.some(n =>
          Array.isArray(n.skills_needed) &&
          n.skills_needed.some((sk: string) =>
            skillTerms.some(t => sk.toLowerCase().includes(t.toLowerCase()))
          )
        )
      )
      // Fallback: show all open seeds if no skill matches
      if (!matchedSeeds.length) matchedSeeds = seedsNeedingBuilders.slice(0, 3)
    }

    const activityHtml = myActivity?.length
      ? myActivity.map(a => {
          const seed = a.seeds as any
          const label: Record<string, string> = {
            seed_created: "Floated a seed",
            node_joined: "Joined a node",
            node_completed: "Completed a node",
            seed_graduated: "Shipped a product",
            seed_commit: "Pushed a commit",
          }
          return `<li style="margin-bottom:10px;font-family:Arial,sans-serif;font-size:14px;color:rgba(245,241,234,0.7);">
            ${label[a.action] || a.action}${seed?.title ? ` — <em style="color:rgba(245,241,234,0.5)">${seed.title}</em>` : ""}
          </li>`
        }).join("")
      : `<li style="font-family:Arial,sans-serif;font-size:14px;color:rgba(245,241,234,0.45);">No activity this week — time to build something.</li>`

    const seedsHtml = matchedSeeds.length
      ? matchedSeeds.map(s => {
          const roles = s.openNodes.map((n: any) => n.role).join(", ")
          return `<tr>
            <td style="padding:16px 0;border-bottom:1px solid rgba(245,241,234,0.08);">
              <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:17px;font-weight:700;color:#F5F1EA;">${s.title}</p>
              <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(245,241,234,0.5);">${(s.problem || "").slice(0, 90)}${s.problem?.length > 90 ? "…" : ""}</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#C0392B;">Open: ${roles}</p>
            </td>
            <td style="padding:16px 0 16px 20px;border-bottom:1px solid rgba(245,241,234,0.08);vertical-align:middle;width:120px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/seeds/${s.slug}" style="display:inline-block;font-family:Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#F5F1EA;border:1px solid rgba(245,241,234,0.25);padding:8px 14px;text-decoration:none;white-space:nowrap;">View →</a>
            </td>
          </tr>`
        }).join("")
      : `<tr><td style="padding:16px 0;font-family:Arial,sans-serif;font-size:14px;color:rgba(245,241,234,0.45);">No seeds matching your skills right now.</td></tr>`

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0E0C09;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0C09;padding:60px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 0 48px 0;border-bottom:1px solid rgba(245,241,234,0.08);">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,241,234,0.3);">Broke Founders · Weekly Digest</p>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:40px 0 32px 0;">
          <h1 style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:36px;font-weight:900;color:#F5F1EA;line-height:1.05;letter-spacing:-0.02em;">This week on<br/><em style="font-weight:400;color:rgba(245,241,234,0.35);">Broke Founders.</em></h1>
        </td></tr>

        <!-- Platform pulse -->
        <tr><td style="padding:0 0 40px 0;">
          <p style="margin:0 0 16px 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,241,234,0.35);">Platform pulse</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="text-align:center;padding:20px;border:1px solid rgba(245,241,234,0.08);">
                <p style="margin:0;font-family:Georgia,serif;font-size:36px;font-weight:900;color:#F5F1EA;">${newSeeds ?? 0}</p>
                <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,241,234,0.35);">New seeds</p>
              </td>
              <td width="8"></td>
              <td style="text-align:center;padding:20px;border:1px solid rgba(245,241,234,0.08);">
                <p style="margin:0;font-family:Georgia,serif;font-size:36px;font-weight:900;color:#F5F1EA;">${newNodes ?? 0}</p>
                <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,241,234,0.35);">Nodes filled</p>
              </td>
              <td width="8"></td>
              <td style="text-align:center;padding:20px;border:1px solid rgba(245,241,234,0.08);">
                <p style="margin:0;font-family:Georgia,serif;font-size:36px;font-weight:900;color:#F5F1EA;">${newBuilders ?? 0}</p>
                <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,241,234,0.35);">New builders</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Your activity -->
        <tr><td style="padding:0 0 40px 0;">
          <p style="margin:0 0 16px 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,241,234,0.35);">Your week</p>
          <ul style="margin:0;padding:0 0 0 18px;">${activityHtml}</ul>
        </td></tr>

        <!-- Seeds needing builders -->
        <tr><td style="padding:0 0 40px 0;border-top:1px solid rgba(245,241,234,0.08);padding-top:40px;">
          <p style="margin:0 0 20px 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,241,234,0.35);">Seeds that need your skills</p>
          <table width="100%" cellpadding="0" cellspacing="0">${seedsHtml}</table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 0 48px 0;">
          <a href="${process.env.NEXT_PUBLIC_URL}/seeds" style="display:inline-block;font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#0E0C09;background:#F5F1EA;padding:14px 28px;text-decoration:none;">Browse all seeds →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="border-top:1px solid rgba(245,241,234,0.08);padding:24px 0 0 0;">
          <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,241,234,0.25);">Broke Founders · broke-founders.vercel.app</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,241,234,0.2);">
            You're receiving this because you're a builder on Broke Founders.
            <a href="${process.env.NEXT_PUBLIC_URL}/settings/email" style="color:rgba(245,241,234,0.3);text-decoration:underline;margin-left:4px;">Unsubscribe from digest</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    try {
      await transporter.sendMail({
        from: `"Broke Founders" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: `This week on Broke Founders — ${newSeeds ?? 0} new seeds, ${newNodes ?? 0} nodes filled`,
        html,
      })
      sent++
    } catch (err) {
      console.error(`[digest] failed for ${user.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({ sent, failed, total: users.length })
}
