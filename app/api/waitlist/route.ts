import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { transporter } from "@/lib/mailer"
import { v4 as uuid } from "uuid"

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

  const token = uuid()

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, token })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already signed up" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }

  const welcomeUrl = `${process.env.NEXT_PUBLIC_URL}/welcome?token=${token}`

  try {
  await transporter.sendMail({
    from: `"Broke Founders" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "You are on the list.",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:#F5F1EA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1EA;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 0 40px 0;border-bottom:1px solid rgba(14,12,9,0.08);">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(14,12,9,0.35);">
                Broke Founders
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:48px 0 24px 0;">
              <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:48px;font-weight:700;color:#0E0C09;line-height:1.0;letter-spacing:-0.02em;">
                You are<br/>on the list.
              </h1>
              <p style="margin:0;font-family:Georgia,serif;font-size:20px;font-style:italic;color:rgba(14,12,9,0.35);">
                Now tell us what you bring.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 36px 0;">
              <p style="margin:0 0 14px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(14,12,9,0.6);">
                We are building a platform for skilled builders who are almost there. Every person who joins brings something real.
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(14,12,9,0.6);">
                One more step. Tell us what you bring. It takes 60 seconds.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 48px 0;">
              <a href="${welcomeUrl}" style="display:inline-block;background:#0E0C09;color:#F5F1EA;font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:16px 32px;">
                Tell us what you bring →
              </a>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid rgba(14,12,9,0.08);padding:28px 0 0 0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(14,12,9,0.3);line-height:1.6;">
                Broke builders. Real products. Shared upside.<br/>
                You signed up at brokefounders.vercel.app
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  })

console.log("Email sent successfully to", email)
} catch (mailError) {
  console.error("Mail error:", mailError)
}

  return NextResponse.json({ success: true })
}