import Link from "next/link"

export const metadata = {
  title: "Privacy Policy — Broke Founders",
  description: "What data we collect, how we use it, and who we share it with.",
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid rgba(14,12,9,0.08)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.65)", textDecoration: "none", fontWeight: 600 }}>Broke Founders</Link>
        <Link href="/legal/terms" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.65)", textDecoration: "none", fontWeight: 600 }}>Terms of service</Link>
      </nav>

      <section style={{ padding: "72px 48px 100px", maxWidth: "720px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(14,12,9,0.6)", marginBottom: "20px", fontWeight: 600 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Privacy policy
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.6)", marginBottom: "64px" }}>
          Last updated: April 2026
        </p>

        <div style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.9, color: "rgba(14,12,9,0.65)" }}>

          <Section title="What we collect">
            <p>When you sign in with GitHub, we receive and store:</p>
            <ul style={{ margin: "12px 0 0 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Your GitHub username and display name</li>
              <li>Your email address (from your GitHub account)</li>
              <li>Your GitHub avatar URL</li>
              <li>A GitHub OAuth token (used to automate repo setup — creating branches and inviting collaborators)</li>
            </ul>
            <p style={{ marginTop: "16px" }}>Once you use the platform, we also store:</p>
            <ul style={{ margin: "12px 0 0 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Seeds you create and the details you enter</li>
              <li>Nodes you join and your contributions</li>
              <li>Messages and updates you post within seeds</li>
              <li>Achievement and score history</li>
            </ul>
          </Section>

          <Section title="What we do not collect">
            <p>We do not collect passwords — authentication is handled entirely by GitHub OAuth.</p>
            <p style={{ marginTop: "12px" }}>We do not store payment card details. Payments go through PayPal or Binance Pay directly — we only receive a confirmation that a payment succeeded.</p>
            <p style={{ marginTop: "12px" }}>We do not read the contents of your private GitHub repositories. The OAuth token we store is used only to create branches and invite collaborators, not to read or copy your code.</p>
          </Section>

          <Section title="How we use your data">
            <p>We use your data to run the platform. Specifically:</p>
            <ul style={{ margin: "12px 0 0 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Your email is used to send platform notifications and the optional weekly digest</li>
              <li>Your GitHub token is used for repository automations when you approve a node</li>
              <li>Your contribution history is used to calculate your score and level</li>
              <li>Your profile data is shown to other builders on the platform</li>
            </ul>
            <p style={{ marginTop: "16px" }}>We do not sell your data. We do not use it for advertising. We do not share it with third parties except as described below.</p>
          </Section>

          <Section title="Third parties we use">
            <p>Running this platform requires a few external services:</p>
            <ul style={{ margin: "12px 0 0 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong style={{ color: "rgba(14,12,9,0.8)" }}>Supabase</strong> — our database. Your data is stored on Supabase's infrastructure. Their privacy policy applies.</li>
              <li><strong style={{ color: "rgba(14,12,9,0.8)" }}>GitHub</strong> — for authentication and repository automation. GitHub's privacy policy applies to what they receive during OAuth.</li>
              <li><strong style={{ color: "rgba(14,12,9,0.8)" }}>Gmail / Google SMTP</strong> — we use a Gmail account to send platform emails. Google's terms apply to email transit.</li>
              <li><strong style={{ color: "rgba(14,12,9,0.8)" }}>PayPal / Binance Pay</strong> — for processing seed creation payments. Your payment details go directly to them, not to us.</li>
              <li><strong style={{ color: "rgba(14,12,9,0.8)" }}>Vercel</strong> — our hosting provider. Request logs may be retained by Vercel per their own policy.</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>We use one cookie: <code style={{ fontFamily: "'Courier New', monospace", fontSize: "13px", background: "rgba(14,12,9,0.05)", padding: "2px 6px" }}>bf_user</code>. It stores your session (user ID, GitHub username, avatar, email) so you stay signed in. It is httpOnly and expires after 30 days. We do not use tracking cookies or analytics cookies.</p>
          </Section>

          <Section title="How to delete your account">
            <p>We do not have a one-click delete button yet. Email us at <a href="mailto:hello@broke-founders.com" style={{ color: "var(--ink)", fontWeight: 600 }}>hello@broke-founders.com</a> and we will delete your account and associated data within 7 days.</p>
            <p style={{ marginTop: "12px" }}>Note: contributions you made to other people's seeds may remain as anonymised records (e.g. "a contributor joined this node") even after your account is deleted.</p>
          </Section>

          <Section title="Changes to this policy">
            <p>If we change what data we collect or how we use it in a meaningful way, we will send an email to all users before the change takes effect. Minor wording updates will not be notified.</p>
          </Section>

        </div>
      </section>

      <footer style={{ padding: "28px 48px", borderTop: "1px solid rgba(14,12,9,0.08)", display: "flex", gap: "24px" }}>
        <Link href="/legal/terms" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.6)", textDecoration: "none", fontWeight: 600 }}>Terms of service</Link>
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.6)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
      </footer>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "48px", paddingBottom: "48px", borderBottom: "1px solid rgba(14,12,9,0.07)" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: "16px" }}>{title}</h2>
      {children}
    </div>
  )
}
