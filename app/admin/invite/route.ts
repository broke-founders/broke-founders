import { NextResponse } from "next/server"
import { transporter } from "@/lib/mailer"
import { cookies } from "next/headers"

const ADMIN_USERNAMES = ["horaizontech"]

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)
  if (!ADMIN_USERNAMES.includes(session.github_username)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { email } = await req.json()

  try {
    await transporter.sendMail({
      from: `"Broke Founders" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your spot on Broke Founders is ready.",
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
          <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:42px;font-weight:700;color:#0E0C09;line-height:1.0;">Your spot<br/>is ready.</h1>
          <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:rgba(14,12,9,0.35);">We built this for you.</p>
        </td></tr>
        <tr><td style="padding:0 0 32px 0;">
          <p style="margin:0 0 14px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(14,12,9,0.65);">
            Broke Founders is live. You are one of the first builders we are letting in.
          </p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(14,12,9,0.65);">
            Sign in with GitHub, float a seed or find one that needs exactly what you have.
          </p>
        </td></tr>
        <tr><td style="padding:0 0 40px 0;">
          <a href="${process.env.NEXT_PUBLIC_URL}/login" style="display:inline-block;background:#0E0C09;color:#F5F1EA;font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:15px 32px;">
            Enter the platform →
          </a>
        </td></tr>
        <tr><td style="border-top:1px solid rgba(14,12,9,0.08);padding:28px 0 0 0;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(14,12,9,0.3);line-height:1.6;">
            Broke builders. Real products. Shared upside.<br/>
            broke-founders.vercel.app
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Mail error:", err)
    return NextResponse.json({ error: "Mail failed", detail: String(err) }, { status: 500 })
  }
}