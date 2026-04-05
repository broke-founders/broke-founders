import { NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { token, category, subcategory, custom_skill } = await req.json()

  if (!token || !category) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const { data: user, error: fetchError } = await supabase
    .from("waitlist")
    .select("id, email, skills_submitted")
    .eq("token", token)
    .single()

  if (fetchError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 })
  }

  if (user.skills_submitted) {
    return NextResponse.json({ success: true, already: true })
  }

  await supabase.from("skills").insert({
    waitlist_id: user.id,
    email: user.email,
    category,
    subcategory,
    custom_skill,
  })

  await supabase
    .from("waitlist")
    .update({ skills_submitted: true })
    .eq("id", user.id)

  await resend.emails.send({
    from: "Broke Founders <onboarding@resend.dev>",
    to: user.email,
    subject: "You are officially in.",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:#0E0C09;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0C09;padding:60px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <tr>
            <td style="padding:0 0 48px 0;border-bottom:1px solid rgba(245,241,234,0.08);">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,241,234,0.3);font-weight:600;">
                Broke Founders
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:48px 0 32px 0;">
              <h1 style="margin:0 0 16px 0;font-family:'Georgia',serif;font-size:48px;font-weight:700;color:#F5F1EA;line-height:1.0;letter-spacing:-0.02em;">
                You are<br/>officially in.
              </h1>
              <p style="margin:0;font-family:'Georgia',serif;font-size:20px;font-weight:400;font-style:italic;color:rgba(245,241,234,0.3);line-height:1.4;">
                We have you on record.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 0 40px 0;">
              <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(245,241,234,0.5);">
                Your skill — <strong style="color:#F5F1EA;">${subcategory || custom_skill || category}</strong> — is on record. When the platform is ready, you will be among the first we reach out to.
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(245,241,234,0.5);">
                We are building this right now. With exactly the kind of people who sign up here.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 0 48px 0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.8;color:rgba(245,241,234,0.25);font-style:italic;">
                "Broke builders. Real products. Shared upside."
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid rgba(245,241,234,0.08);padding:32px 0 0 0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,241,234,0.2);line-height:1.6;">
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

  return NextResponse.json({ success: true })
}