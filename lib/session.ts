import { cookies } from "next/headers"

export type SessionUser = {
  id: string
  github_username: string
  github_avatar: string
  name: string
  email: string
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}