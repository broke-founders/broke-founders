import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { transporter } from "@/lib/mailer"
import { cookies } from "next/headers"
import { notify } from "@/lib/notify"

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { node_id, seed_id, message } = await req.json()
  if (!node_id || !seed_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  // Check not already requested
  const { data: existing } = await supabase
    .from("node_requests")
    .select("id")
    .eq("node_id", node_id)
    .eq("requester_id", session.id)
    .single()

  if (existing) return NextResponse.json({ error: "Already requested" }, { status: 409 })

  // Create request
  await supabase.from("node_requests").insert({
    node_id,
    seed_id,
    requester_id: session.id,
    message,
  })

  // Get seed + originator email
  const { data: seed } = await supabase
    .from("seeds")
    .select("title, originator_id")
    .eq("id", seed_id)
    .single()

  const { data: originator } = await supabase
    .from("users")
    .select("email, username")
    .eq("id", seed?.originator_id)
    .single()

  const { data: node } = await supabase
    .from("nodes")
    .select("role")
    .eq("id", node_id)
    .single()

  if (originator?.email) {
    await transporter.sendMail({
      from: `"Broke Founders" <${process.env.GMAIL_USER}>`,
      to: originator.email,
      subject: `New request for ${node?.role} on ${seed?.title}`,
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
          <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:36px;font-weight:700;color:#0E0C09;line-height:1.0;">New node request</h1>
          <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:rgba(14,12,9,0.4);">${seed?.title}</p>
        </td></tr>
        <tr><td style="padding:0 0 32px 0;">
          <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(14,12,9,0.6);">
            <strong style="color:#0E0C09;">@${session.github_username}</strong> wants to join as <strong style="color:#0E0C09;">${node?.role}</strong>.
          </p>
          ${message ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:rgba(14,12,9,0.6);padding:16px;background:rgba(14,12,9,0.04);">"${message}"</p>` : ""}
        </td></tr>
        <tr><td style="padding:0 0 40px 0;">
          <a href="${process.env.NEXT_PUBLIC_URL}/seeds/${seed_id}" style="display:inline-block;background:#0E0C09;color:#F5F1EA;font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
            Review request →
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

  await notify({
    user_id: seed?.originator_id,
    type: "node_request",
    title: `New request for ${node?.role}`,
    body: `@${session.github_username} wants to join ${seed?.title}`,
    link: `/seeds/${seed_id}`,
  })

  return NextResponse.json({ success: true })
}