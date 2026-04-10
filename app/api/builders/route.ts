import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getLevel } from "@/lib/contributions"

export async function GET() {
  const { data: users } = await supabase
    .from("users")
    .select("id, username, name, avatar_url, created_at, email")
    .order("created_at", { ascending: false })

  if (!users?.length) return NextResponse.json({ builders: [] })

  const builders = await Promise.all(users.map(async (user) => {
    // Score from contributions
    const { data: contribs } = await supabase
      .from("contributions")
      .select("points")
      .eq("user_id", user.id)
    const score = (contribs || []).reduce((s, c) => s + (c.points || 0), 0)

    // Seeds count
    const { count: seedsCount } = await supabase
      .from("seeds")
      .select("*", { count: "exact", head: true })
      .eq("originator_id", user.id)

    // Skills via email join
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
      skills: (skills || []).map(s => s.subcategory || s.custom_skill || s.category).filter(Boolean),
      seedsCount: seedsCount || 0,
    }
  }))

  return NextResponse.json({ builders })
}
