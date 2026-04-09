import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { notify } from "@/lib/notify"

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { searchParams } = new URL(req.url)
  const withUsername = searchParams.get("with")

  // --- Thread view ---
  if (withUsername) {
    const { data: otherUser } = await supabase
      .from("users")
      .select("id, username, avatar_url, name")
      .eq("username", withUsername)
      .single()

    if (!otherUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { data: messages } = await supabase
      .from("direct_messages")
      .select("*, sender:users!sender_id(username, avatar_url)")
      .or(
        `and(sender_id.eq.${session.id},receiver_id.eq.${otherUser.id}),` +
        `and(sender_id.eq.${otherUser.id},receiver_id.eq.${session.id})`
      )
      .order("created_at", { ascending: true })
      .limit(100)

    // Mark incoming as read
    await supabase
      .from("direct_messages")
      .update({ read: true })
      .eq("sender_id", otherUser.id)
      .eq("receiver_id", session.id)
      .eq("read", false)

    return NextResponse.json({ messages: messages || [], otherUser, myId: session.id })
  }

  // --- Conversations list ---
  const { data: msgs } = await supabase
    .from("direct_messages")
    .select("id, content, read, created_at, sender_id, receiver_id")
    .or(`sender_id.eq.${session.id},receiver_id.eq.${session.id}`)
    .order("created_at", { ascending: false })

  if (!msgs?.length) return NextResponse.json({ conversations: [], unreadCount: 0 })

  const partnerIds = [...new Set(
    msgs.map(m => m.sender_id === session.id ? m.receiver_id : m.sender_id)
  )]

  const { data: users } = await supabase
    .from("users")
    .select("id, username, avatar_url, name")
    .in("id", partnerIds)

  const userMap = Object.fromEntries((users || []).map(u => [u.id, u]))

  const seen = new Set<string>()
  const conversations = []

  for (const msg of msgs) {
    const partnerId = msg.sender_id === session.id ? msg.receiver_id : msg.sender_id
    if (seen.has(partnerId)) continue
    seen.add(partnerId)

    const unread = msgs.filter(
      m => m.sender_id === partnerId && m.receiver_id === session.id && !m.read
    ).length

    conversations.push({ partner: userMap[partnerId] || null, latest: msg, unread })
  }

  const unreadCount = conversations.reduce((s, c) => s + c.unread, 0)
  return NextResponse.json({ conversations, unreadCount })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { to, content } = await req.json()
  if (!to || !content?.trim()) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const { data: receiver } = await supabase
    .from("users")
    .select("id")
    .eq("username", to)
    .single()

  if (!receiver) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (receiver.id === session.id) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 })

  const { data: message, error } = await supabase
    .from("direct_messages")
    .insert({ sender_id: session.id, receiver_id: receiver.id, content: content.trim(), read: false })
    .select("*, sender:users!sender_id(username, avatar_url)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await notify({
    user_id: receiver.id,
    type: "direct_message",
    title: `Message from @${session.github_username}`,
    body: content.slice(0, 100),
    link: `/messages/${session.github_username}`,
  })

  return NextResponse.json({ message })
}
