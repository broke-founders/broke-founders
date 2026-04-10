"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type Props = {
  username?: string
}

export function MobileNav({ username }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  function close() { setOpen(false) }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/seeds", label: "Seeds" },
    { href: "/chat", label: "Feed" },
    { href: username ? `/u/${username}` : "/dashboard", label: "My Profile" },
  ]

  return (
    <>
      {/* Hamburger — only visible on mobile via CSS class */}
      <button
        className="mobile-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          flexDirection: "column",
          justifyContent: "center",
          gap: "5px",
          alignItems: "center",
        }}
      >
        <span style={{display:"block",width:"22px",height:"2px",background:"var(--ink)"}} />
        <span style={{display:"block",width:"22px",height:"2px",background:"var(--ink)"}} />
        <span style={{display:"block",width:"22px",height:"2px",background:"var(--ink)"}} />
      </button>

      {/* Backdrop + slide-in panel */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: open ? "rgba(14,12,9,0.45)" : "transparent",
          pointerEvents: open ? "all" : "none",
          transition: "background 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "300px",
            background: "var(--paper)",
            borderLeft: "1px solid rgba(14,12,9,0.08)",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            display: "flex",
            flexDirection: "column",
            padding: "28px 32px",
          }}
        >
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"48px"}}>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",fontWeight:600}}>
              Menu
            </span>
            <button
              onClick={close}
              aria-label="Close menu"
              style={{background:"transparent",border:"none",cursor:"pointer",padding:"4px",color:"var(--ink)",display:"flex",alignItems:"center"}}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav style={{flex:1}}>
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                onClick={close}
                style={{
                  display: "block",
                  fontFamily: "var(--font-serif)",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  textDecoration: "none",
                  lineHeight: "48px",
                  borderBottom: "1px solid rgba(14,12,9,0.06)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Sign out */}
          <a
            href="/api/auth/logout"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "rgba(14,12,9,0.4)",
              textDecoration: "none",
              marginTop: "32px",
            }}
            onClick={close}
          >
            Sign out →
          </a>
        </div>
      </div>
    </>
  )
}
