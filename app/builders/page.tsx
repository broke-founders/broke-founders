import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getLevel } from "@/lib/contributions"
import { BuilderSearch } from "@/components/BuilderSearch"

export const revalidate = 300

async function getBuilders() {
  const { data: users } = await supabase
    .from("users")
    .select("id, username, name, avatar_url, email")
    .order("created_at", { ascending: false })

  if (!users?.length) return []

  const builders = await Promise.all(users.map(async (user) => {
    const { data: contribs } = await supabase
      .from("contributions")
      .select("points")
      .eq("user_id", user.id)
    const score = (contribs || []).reduce((s: number, c: any) => s + (c.points || 0), 0)

    const { count: seedsCount } = await supabase
      .from("seeds")
      .select("*", { count: "exact", head: true })
      .eq("originator_id", user.id)

    const { data: skills } = user.email
      ? await supabase
          .from("skills")
          .select("category, subcategory, custom_skill")
          .eq("email", user.email)
          .limit(5)
      : { data: [] }

    const level = getLevel(score)
    const topSkill = skills?.[0]
      ? (skills[0].subcategory || skills[0].custom_skill || skills[0].category)
      : null

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      avatar_url: user.avatar_url,
      score,
      level,
      topSkill,
      skills: (skills || []).map((s: any) => s.subcategory || s.custom_skill || s.category).filter(Boolean),
      seedsCount: seedsCount || 0,
    }
  }))

  return builders
}

export default async function BuildersPage() {
  const builders = await getBuilders()

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid rgba(14,12,9,0.1)" }}>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.55)", textDecoration: "none", fontWeight: 600 }}>← Dashboard</Link>
        <Link href="/seeds" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(14,12,9,0.55)", textDecoration: "none", fontWeight: 600 }}>Browse seeds</Link>
      </nav>

      <section style={{ padding: "64px 48px", maxWidth: "1100px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--red)", marginBottom: "20px", fontWeight: 600 }}>Builders</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Find your<br /><em style={{ fontWeight: 400, color: "rgba(14,12,9,0.3)" }}>next teammate.</em>
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.5)", marginBottom: "48px" }}>
          {builders.length} builders on the platform
        </p>

        <BuilderSearch builders={builders} />
      </section>
    </main>
  )
}
