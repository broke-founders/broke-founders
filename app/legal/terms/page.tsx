import Link from "next/link"

export const metadata = {
  title: "Terms of Service — Broke Founders",
  description: "What Broke Founders is, what it is not, and what you agree to by using it.",
}

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid rgba(14,12,9,0.08)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.65)", textDecoration: "none", fontWeight: 600 }}>Broke Founders</Link>
        <Link href="/legal/privacy" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.65)", textDecoration: "none", fontWeight: 600 }}>Privacy policy</Link>
      </nav>

      <section style={{ padding: "72px 48px 100px", maxWidth: "720px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(14,12,9,0.6)", marginBottom: "20px", fontWeight: 600 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Terms of service
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.6)", marginBottom: "64px" }}>
          Last updated: April 2026
        </p>

        <div style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.9, color: "rgba(14,12,9,0.65)" }}>

          <Section title="What Broke Founders is">
            <p>Broke Founders is a platform where builders find each other, agree on equity splits, and build things together. We provide the tools to declare a project, scope the work, connect the people, and record the agreement. We do not employ anyone. We do not manage the work. We are the noticeboard, not the general contractor.</p>
            <p style={{ marginTop: "16px" }}>When you use this platform, you are building a team and entering into agreements with other people — not with us.</p>
          </Section>

          <Section title="User responsibilities">
            <p>You are responsible for being honest about your skills. You are responsible for the commitments you make when joining a seed. You are responsible for communicating with your team when things change.</p>
            <p style={{ marginTop: "16px" }}>We do not tolerate bad faith behaviour: ghosting after signing, deliberately misrepresenting your skills, or using the platform to mine contacts with no intent to build.</p>
            <p style={{ marginTop: "16px" }}>We reserve the right to archive or remove accounts that repeatedly harm other builders.</p>
          </Section>

          <Section title="Equity agreements — an honest disclaimer">
            <p>We are not lawyers. Nothing on this platform constitutes legal advice.</p>
            <p style={{ marginTop: "16px" }}>The equity agreements generated here are statements of intent between builders. They are not legally binding contracts unless you take them to a lawyer and make them so. If your seed becomes something worth arguing about, you will need a proper legal structure — a registered company, a shareholders agreement, a lawyer. Broke Founders does not provide or replace any of that.</p>
            <p style={{ marginTop: "16px" }}>The agreements are a starting point and a record. What you do with them is up to you.</p>
          </Section>

          <Section title="GitHub integration">
            <p>When you connect your GitHub account, we request repo-level access to automate branch creation and collaborator invites. We do not read your private repositories beyond what is necessary for those automations. We do not store your code. We do not index or expose your private repositories.</p>
            <p style={{ marginTop: "16px" }}>You can revoke our GitHub access at any time from your GitHub settings. Doing so will only stop future automations — it will not remove branches or collaborators already created.</p>
          </Section>

          <Section title="Data we store">
            <p>We store: your GitHub username, display name, email address, avatar URL, contribution history, and seed activity. We store OAuth tokens to enable GitHub automations on your behalf. We store messages and updates posted within seeds.</p>
            <p style={{ marginTop: "16px" }}>We do not sell your data. We do not use it for advertising. We use it to run the platform.</p>
          </Section>

          <Section title="Payments">
            <p>Seed creation fees are processed by PayPal or Binance Pay. We do not store payment card details. Once a payment is confirmed, it is non-refundable — you are paying for the seed listing, not a guarantee of outcomes.</p>
          </Section>

          <Section title="Contact">
            <p>If you have a question, a complaint, or you want to delete your account, email us. We are a small team and we will respond like humans.</p>
            <p style={{ marginTop: "12px" }}>
              <a href="mailto:hello@broke-founders.com" style={{ color: "var(--ink)", fontWeight: 600 }}>hello@broke-founders.com</a>
            </p>
          </Section>

        </div>
      </section>

      <footer style={{ padding: "28px 48px", borderTop: "1px solid rgba(14,12,9,0.08)", display: "flex", gap: "24px" }}>
        <Link href="/legal/privacy" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.6)", textDecoration: "none", fontWeight: 600 }}>Privacy policy</Link>
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
