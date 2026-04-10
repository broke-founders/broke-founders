"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Notification = {
  id: string
  type: string
  title: string
  body: string
  link: string
  read: boolean
  created_at: string
}

export function NotificationBell({ userId }: { userId: string }) {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [dmUnread, setDmUnread] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => setNotifs(d.notifications || []))

    fetch("/api/direct-messages")
      .then(r => r.json())
      .then(d => setDmUnread(d.unreadCount || 0))
  }, [])

  // Realtime — notifications
  useEffect(() => {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        setNotifs(prev => [payload.new as Notification, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  // Realtime — incoming DMs
  useEffect(() => {
    const channel = supabase
      .channel(`dm-bell-${userId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
        filter: `receiver_id=eq.${userId}`,
      }, () => {
        setDmUnread(prev => prev + 1)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const notifUnread = notifs.filter(n => !n.read).length
  const totalUnread = notifUnread + dmUnread

  async function markRead() {
    await fetch("/api/notifications", { method: "PATCH" })
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div style={{position:"relative"}}>
      <button
        onClick={() => { setOpen(!open); if (!open && notifUnread > 0) markRead() }}
        style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.55)",background:"transparent",border:"none",cursor:"pointer",position:"relative",padding:"4px 8px"}}
      >
        {totalUnread > 0 && (
          <span style={{position:"absolute",top:0,right:0,minWidth:7,height:7,borderRadius:"4px",background:"var(--red)"}}></span>
        )}
        ●
      </button>

      {open && (
        <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:320,background:"var(--paper)",border:"1px solid rgba(14,12,9,0.12)",zIndex:200,maxHeight:400,overflowY:"auto"}}>
          <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(14,12,9,0.08)"}}>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.55)"}}>Notifications</span>
          </div>

          {/* Unread DM shortcut */}
          {dmUnread > 0 && (
            <Link href="/messages" onClick={() => { setOpen(false); setDmUnread(0) }} style={{textDecoration:"none",color:"inherit",display:"block"}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(14,12,9,0.06)",background:"rgba(14,12,9,0.025)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"13px",fontWeight:600,color:"rgba(14,12,9,0.85)",display:"block",marginBottom:"2px"}}>
                    {dmUnread} unread message{dmUnread > 1 ? "s" : ""}
                  </span>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.65)"}}>View in Messages →</span>
                </div>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",fontWeight:700,color:"var(--paper)",background:"var(--red)",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {dmUnread}
                </span>
              </div>
            </Link>
          )}

          {notifs.length === 0 && dmUnread === 0 && (
            <div style={{padding:"24px 16px",fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.6)"}}>Nothing yet.</div>
          )}
          {notifs.map(n => (
            <Link key={n.id} href={n.link || "/dashboard"} onClick={() => setOpen(false)} style={{textDecoration:"none",color:"inherit",display:"block"}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(14,12,9,0.06)",background:n.read?"transparent":"rgba(14,12,9,0.025)",transition:"background 0.2s ease"}}>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"13px",fontWeight:n.read?400:600,color:"rgba(14,12,9,0.85)",display:"block",marginBottom:"3px"}}>{n.title}</span>
                {n.body && <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.7)",display:"block",marginBottom:"4px"}}>{n.body}</span>}
                <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.55)"}}>{new Date(n.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
