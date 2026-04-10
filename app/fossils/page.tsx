import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const revalidate = 300

async function getFossils() {
  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, slug, title, problem, originator_stake, created_at, originator_id, users(username, avatar_url)")
    .eq("stage", "fossil")
    .order("created_at", { ascending: false })

  if (!seeds?.length) return []

  const fossils = await Promise.all(seeds.map(async (seed) => {
    const { data: nodes } = await supabase
      .from("nodes")
      .select("id, role, contributor_id, status")
      .eq("seed_id", seed.id)

    const { count: contribCount } = await supabase
      .from("contributions")
      .select("*", { count: "exact", head: true })
      .eq("seed_id", seed.id)

    const teamSize = new Set(
      (nodes || [])
        .filter(n => n.contributor_id)
        .map(n => n.contributor_id)
    ).size + 1 // +1 for originator

    return {
      ...seed,
      teamSize,
      contribCount: contribCount || 0,
      nodeCount: (nodes || []).length,
    }
  }))

  return fossils
}

export default async function FossilsPage() {
  const fossils = await getFossils()

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid rgba(14,12,9,0.08)" }}>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.45)", textDecoration: "none", fontWeight: 600 }}>← Dashboard</Link>
        <Link href="/seeds" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.45)", textDecoration: "none", fontWeight: 600 }}>Live seeds</Link>
      </nav>

      <section style={{ padding: "72px 48px 100px", maxWidth: "880px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(14,12,9,0.4)", marginBottom: "20px", fontWeight: 600 }}>
          The Archive
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px,7vw,80px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "20px" }}>
          Every attempt<br />
          <em style={{ fontWeight: 400, color: "rgba(14,12,9,0.25)" }}>is worth recording.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", lineHeight: 1.85, color: "rgba(14,12,9,0.5)", maxWidth: "520px", marginBottom: "72px" }}>
          These seeds did not ship. That does not mean nothing happened. Real work was done, real people showed up, and something was learned. That counts.
        </p>

        {fossils.length === 0 ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.35)" }}>
            Nothing here yet. All seeds are still in play.
          </p>
        ) : (
          <div style={{ borderTop: "1px solid rgba(14,12,9,0.08)" }}>
            {fossils.map((fossil: any) => (
              <div key={fossil.id} style={{ padding: "40px 0", borderBottom: "1px solid rgba(14,12,9,0.08)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.35)", fontWeight: 600, padding: "3px 8px", border: "1px solid rgba(14,12,9,0.12)" }}>
                        fossilized
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.35)" }}>
                        {new Date(fossil.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px", color: "rgba(14,12,9,0.75)" }}>
                      {fossil.title}
                    </h2>

                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", lineHeight: 1.8, color: "rgba(14,12,9,0.45)", maxWidth: "540px", marginBottom: "20px" }}>
                      {fossil.problem?.slice(0, 160)}{fossil.problem?.length > 160 ? "…" : ""}
                    </p>

                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.45)" }}>
                        <strong style={{ color: "rgba(14,12,9,0.7)" }}>{fossil.teamSize}</strong> {fossil.teamSize === 1 ? "person" : "people"} involved
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.45)" }}>
                        <strong style={{ color: "rgba(14,12,9,0.7)" }}>{fossil.nodeCount}</strong> {fossil.nodeCount === 1 ? "node" : "nodes"} scoped
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.45)" }}>
                        <strong style={{ color: "rgba(14,12,9,0.7)" }}>{fossil.contribCount}</strong> contributions logged
                      </span>
                      {(fossil.users as any)?.username && (
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.45)" }}>
                          by{" "}
                          <Link href={`/u/${(fossil.users as any).username}`} style={{ color: "rgba(14,12,9,0.6)", textDecoration: "none", fontWeight: 600 }}>
                            @{(fossil.users as any).username}
                          </Link>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/seeds/${fossil.slug}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "rgba(14,12,9,0.35)", textDecoration: "none", border: "1px solid rgba(14,12,9,0.12)", padding: "8px 14px", flexShrink: 0, marginTop: "4px" }}
                  >
                    View seed
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
