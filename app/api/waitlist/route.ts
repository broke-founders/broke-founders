import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: "Broke Founders <onboarding@resend.dev>",
      to: "ahmed.javed6@gmail.com",
      subject: "New waitlist signup",
      html: `<p>New signup: <strong>${email}</strong></p>`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}