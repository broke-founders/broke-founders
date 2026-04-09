import { supabase } from "./supabase"

type Action = 
  | "seed_created"
  | "node_joined"
  | "node_completed"
  | "node_dropped"
  | "seed_graduated"
  | "seed_fossilized"

const POINTS: Record<Action, number> = {
  seed_created: 10,
  node_joined: 5,
  node_completed: 20,
  node_dropped: 0,
  seed_graduated: 50,
  seed_fossilized: 0,
}

const ACHIEVEMENTS: Record<string, { action: Action, check: (count: number) => boolean, label: string }[]> = {
  seed_created: [
    { action: "seed_created", check: c => c === 1, label: "First Seed" },
    { action: "seed_created", check: c => c === 3, label: "Serial Builder" },
    { action: "seed_created", check: c => c === 5, label: "Idea Machine" },
  ],
  node_joined: [
    { action: "node_joined", check: c => c === 1, label: "First Contribution" },
    { action: "node_joined", check: c => c === 5, label: "Team Player" },
  ],
  node_completed: [
    { action: "node_completed", check: c => c === 1, label: "Delivered" },
    { action: "node_completed", check: c => c === 3, label: "Consistent" },
  ],
  seed_graduated: [
    { action: "seed_graduated", check: c => c === 1, label: "Shipped" },
    { action: "seed_graduated", check: c => c === 3, label: "Founder" },
  ],
}

export const LEVELS = [
  { min: 0,   max: 50,  title: "Seed",    color: "rgba(14,12,9,0.4)" },
  { min: 51,  max: 150, title: "Sprout",  color: "#7BAE7F" },
  { min: 151, max: 300, title: "Builder", color: "#4A90D9" },
  { min: 301, max: 500, title: "Founder", color: "#E8A020" },
  { min: 501, max: Infinity, title: "Veteran", color: "#C0392B" },
]

export function getLevel(points: number) {
  return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0]
}

export async function logContribution({
  user_id, seed_id, node_id, action, meta
}: {
  user_id: string
  seed_id: string
  node_id?: string
  action: Action
  meta?: Record<string, any>
}) {
  const points = POINTS[action]

  await supabase.from("contributions").insert({
    user_id,
    seed_id,
    node_id: node_id || null,
    action,
    points,
    meta: meta || {},
  })

  // Check achievements
  const { count } = await supabase
    .from("contributions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id)
    .eq("action", action)

  const checks = ACHIEVEMENTS[action] || []
  for (const check of checks) {
    if (check.check(count || 0)) {
      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", user_id)
        .eq("achievement", check.label)
        .single()

      if (!existing) {
        await supabase.from("achievements").insert({
          user_id,
          achievement: check.label,
        })
      }
    }
  }
}

export async function getUserScore(user_id: string): Promise<number> {
  const { data } = await supabase
    .from("contributions")
    .select("points")
    .eq("user_id", user_id)

  return (data || []).reduce((s, c) => s + (c.points || 0), 0)
}