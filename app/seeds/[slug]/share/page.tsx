import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: seed } = await supabase
    .from("seeds")
    .select("id, title, problem, originator_stake, users(username, avatar_url)")
    .eq("slug", slug)
    .single()

  const { data: nodes } = seed
    ? await supabase
        .from("nodes")
        .select("id, role, slice, status")
        .eq("seed_id", seed.id)
    : { data: [] }

  const openNodes = (nodes || []).filter((n: any) => n.status === "open")

  if (!seed) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.7)" }}>Seed not found.</p>
      </main>
    )
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", padding: "80px 48px" }}>
      <div style={{ maxWidth: "640px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--red)", marginBottom: "24px", fontWeight: 600 }}>
          Broke Founders · Seed
        </p>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px,8vw,88px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "40px" }}>
          {seed.title}
        </h1>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", lineHeight: 1.85, color: "rgba(14,12,9,0.65)", maxWidth: "520px", marginBottom: "56px" }}>
          {seed.problem}
        </p>

        {openNodes.length > 0 && (
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(14,12,9,0.7)", marginBottom: "20px", fontWeight: 600 }}>
              Open nodes — {openNodes.length} {openNodes.length === 1 ? "role" : "roles"} available
            </p>
            <div style={{ borderTop: "1px solid rgba(14,12,9,0.08)" }}>
              {openNodes.map((node: any) => (
                <div key={node.id} style={{ padding: "16px 0", borderBottom: "1px solid rgba(14,12,9,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700 }}>{node.role}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--red)", fontWeight: 600, letterSpacing: "0.1em" }}>{node.slice}% equity</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href={`/seeds/${slug}`}
            style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "var(--paper)", background: "var(--ink)", padding: "16px 32px", textDecoration: "none", display: "inline-block" }}
          >
            Join this seed →
          </Link>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.55)" }}>
            by @{(seed.users as any)?.username}
          </span>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,9,0.25)", marginTop: "80px", fontWeight: 600 }}>
          Broke Founders — Skills for equity.
        </p>
      </div>
    </main>
  )
}
