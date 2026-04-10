"use client"

import { Chat } from "@/components/Chat"
import { SeedUpdates } from "@/components/SeedUpdates"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { RequestButton } from "./RequestButton"
import { AgreementModal } from "@/components/AgreementModal"
import { CommitLog } from "@/components/CommitLog"
import { MobileNav } from "@/components/MobileNav"

export default function SeedPage() {
  const params = useParams()
  const slug = params.slug as string
  const [seed, setSeed] = useState<any>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareMsg, setShareMsg] = useState("")
  const [showAgreement, setShowAgreement] = useState(false)
  const [me, setMe] = useState<any>(null)
  const [graduating, setGraduating] = useState(false)
  const [confirmGraduate, setConfirmGraduate] = useState(false)
  const [agreementSigned, setAgreementSigned] = useState<boolean | null>(null)

  useEffect(() => {
    fetch(`/api/seeds/${slug}`)
      .then(r => r.json())
      .then(data => {
        setSeed(data.seed)
        setNodes(data.nodes)
        setLoading(false)
      })
    fetch("/api/me").then(r => r.json()).then(d => setMe(d.user))
  }, [slug])

  useEffect(() => {
    if (!seed || !me) return
    const isContributor = nodes.some((n: any) => n.contributor_id === me.id)
    if (!isContributor) { setAgreementSigned(true); return }
    fetch(`/api/seeds/${slug}/agreement`)
      .then(r => r.json())
      .then(d => setAgreementSigned(d.available ? d.currentUserSigned : true))
  }, [seed, me, nodes, slug])

  async function graduate() {
    setGraduating(true)
    const res = await fetch(`/api/seeds/${slug}/graduate`, { method: "POST" })
    if (res.ok) {
      setSeed((prev: any) => ({ ...prev, stage: "grove" }))
    }
    setGraduating(false)
    setConfirmGraduate(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setShowShare(false)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyTweet() {
    const openRoles = nodes.filter((n: any) => n.status === "open").map((n: any) => n.role).join(", ")
    const text = `Building ${seed.title} on @BrokeFounders — looking for ${openRoles || "builders"}. Join: ${window.location.href}`
    navigator.clipboard.writeText(text)
    setShareMsg("Tweet copied ✓")
    setShowShare(false)
    setTimeout(() => setShareMsg(""), 2000)
  }

  function copyLinkedIn() {
    const openRoles = nodes.filter((n: any) => n.status === "open").map((n: any) => n.role).join(", ")
    const text = `I'm building ${seed.title} on Broke Founders — a platform where skilled builders team up for equity, not salary.\n\nLooking for: ${openRoles || "builders"}\n\nIf you want to build something real, join here: ${window.location.href}`
    navigator.clipboard.writeText(text)
    setShareMsg("LinkedIn post copied ✓")
    setShowShare(false)
    setTimeout(() => setShareMsg(""), 2000)
  }

  if (loading) return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.72)"}}>Loading...</span>
    </main>
  )

  if (!seed) return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.6)"}}>Seed not found.</span>
    </main>
  )

  const totalNodeSlices = nodes.reduce((s: number, n: any) => s + n.slice, 0)
  const openNodes = nodes.filter(n => n.status === "open")
  const allNodesFilled = nodes.length > 0 && nodes.every(n => n.status === "active")

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)",position:"sticky",top:0,background:"rgba(245,241,234,0.92)",backdropFilter:"blur(12px)",zIndex:100}}>
        <Link href="/seeds" style={{fontFamily:"var(--font-sans)",fontSize:"12px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.72)",textDecoration:"none",fontWeight:600}}>← Seeds</Link>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          {/* Share button + dropdown */}
          <div style={{position:"relative"}}>
            <button onClick={() => setShowShare(s => !s)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:copied||shareMsg?"var(--red)":"rgba(14,12,9,0.6)",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",padding:"8px 16px",cursor:"pointer"}}>
              {copied ? "Copied ✓" : shareMsg || "Share"}
            </button>
            {showShare && (
              <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"var(--paper)",border:"1px solid rgba(14,12,9,0.12)",minWidth:"200px",zIndex:200}}>
                <button onClick={copyLink} style={{display:"block",width:"100%",textAlign:"left",fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.7)",background:"transparent",border:"none",padding:"12px 16px",cursor:"pointer",borderBottom:"1px solid rgba(14,12,9,0.06)"}}>Copy link</button>
                <button onClick={copyTweet} style={{display:"block",width:"100%",textAlign:"left",fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.7)",background:"transparent",border:"none",padding:"12px 16px",cursor:"pointer",borderBottom:"1px solid rgba(14,12,9,0.06)"}}>Copy X / Twitter post</button>
                <button onClick={copyLinkedIn} style={{display:"block",width:"100%",textAlign:"left",fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.7)",background:"transparent",border:"none",padding:"12px 16px",cursor:"pointer"}}>Copy LinkedIn post</button>
              </div>
            )}
          </div>
          <div className="desktop-nav-links">
            {allNodesFilled && (
              <button onClick={() => setShowAgreement(true)} className="btn btn-outline" style={{fontSize:"11px",padding:"8px 16px"}}>
                View Agreement
              </button>
            )}
            {me && seed.originator_id === me.id && ["sprout","shoot"].includes(seed.stage) && (
              confirmGraduate ? (
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.6)"}}>Graduate this seed?</span>
                  <button onClick={graduate} disabled={graduating} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",border:"none",padding:"8px 16px",cursor:"pointer"}}>
                    {graduating ? "…" : "Confirm"}
                  </button>
                  <button onClick={() => setConfirmGraduate(false)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.45)",background:"transparent",border:"none",cursor:"pointer"}}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmGraduate(true)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(61,186,122,0.9)",background:"transparent",border:"1px solid rgba(61,186,122,0.35)",padding:"8px 16px",cursor:"pointer"}}>
                  Graduate →
                </button>
              )
            )}
            {seed.stage === "grove" && (
              <Link href={`/seeds/${slug}/graduated`} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(61,186,122,0.9)",textDecoration:"none",border:"1px solid rgba(61,186,122,0.35)",padding:"8px 16px"}}>
                🌿 Graduated
              </Link>
            )}
            <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"12px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.72)",textDecoration:"none",fontWeight:600}}>Dashboard</Link>
          </div>
          <MobileNav username={me?.github_username} />
        </div>
      </nav>

      <section style={{padding:"72px 48px 100px",maxWidth:"880px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"28px"}}>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--red)",fontWeight:600,padding:"4px 10px",border:"1px solid rgba(192,57,43,0.72)",background:"rgba(192,57,43,0.06)"}}>{seed.stage}</span>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.72)"}}>{new Date(seed.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
          {openNodes.length > 0 && <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.6)"}}>· {openNodes.length} open {openNodes.length === 1 ? "node" : "nodes"}</span>}
        </div>

        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(40px,7vw,80px)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:"32px"}}>{seed.title}</h1>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"17px",lineHeight:1.9,color:"rgba(14,12,9,0.6)",maxWidth:"580px",marginBottom:"56px"}}>{seed.problem}</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"32px",padding:"28px 0",borderTop:"1px solid var(--faint)",borderBottom:"1px solid var(--faint)",marginBottom:"56px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            {seed.users?.avatar_url
              ? <img src={seed.users.avatar_url} alt="" width={36} height={36} style={{borderRadius:"50%"}}/>
              : <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(14,12,9,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",fontSize:"12px",fontWeight:600,color:"rgba(14,12,9,0.6)"}}>{seed.users?.username?.[0]?.toUpperCase()||"?"}</div>
            }
            <div>
<Link href={`/u/${seed.users?.username}`} style={{fontFamily:"var(--font-sans)",fontSize:"14px",fontWeight:700,display:"block",color:"rgba(14,12,9,0.9)",textDecoration:"none"}}>@{seed.users?.username||"unknown"}</Link>              <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.6)"}}>Originator · {seed.originator_stake}% stake</span>
            </div>
          </div>
          {seed.graduation_threshold ? (
            <div style={{textAlign:"right"}}>
              <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.72)",display:"block",marginBottom:"4px",fontWeight:600}}>Graduates when</span>
              <span style={{fontFamily:"var(--font-serif)",fontSize:"17px",fontWeight:700}}>{seed.graduation_threshold}</span>
              {seed.github_repo && seed.repo_setup && (
                <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(61,186,122,0.8)",fontWeight:600,display:"block",marginTop:"8px",letterSpacing:"0.15em",textTransform:"uppercase"}}>✓ Repo setup</span>
              )}
            </div>
          ) : seed.github_repo && seed.repo_setup ? (
            <div style={{textAlign:"right"}}>
              <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(61,186,122,0.8)",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase"}}>✓ Repo setup</span>
              <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.45)",display:"block",marginTop:"4px"}}>Branches created</span>
            </div>
          ) : null}
        </div>

        <div style={{marginBottom:"56px"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",marginBottom:"16px",fontWeight:600}}>Equity breakdown</p>
          <div style={{height:"10px",background:"rgba(14,12,9,0.06)",display:"flex",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${seed.originator_stake}%`,background:"var(--ink)"}}></div>
            <div style={{height:"100%",width:`${totalNodeSlices}%`,background:"rgba(14,12,9,0.25)"}}></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.6)",marginTop:"10px"}}>
            <span>Originator: <strong style={{color:"var(--ink)"}}>{seed.originator_stake}%</strong></span>
            <span>Nodes: <strong style={{color:"var(--ink)"}}>{totalNodeSlices}%</strong></span>
            <span>Unallocated: <strong style={{color:"var(--ink)"}}>{100-seed.originator_stake-totalNodeSlices}%</strong></span>
          </div>
        </div>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",marginBottom:"24px",fontWeight:600}}>Nodes — {nodes.length} total</p>

        <div style={{borderTop:"1px solid var(--faint)"}}>
          {nodes.map((node: any) => (
            <div key={node.id} style={{padding:"36px 0",borderBottom:"1px solid var(--faint)"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"16px"}}>
                <div>
                  <span style={{fontFamily:"var(--font-serif)",fontSize:"26px",fontWeight:700,display:"block",marginBottom:"6px"}}>{node.role}</span>
                  <div style={{display:"flex",gap:"16px"}}>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"var(--red)",fontWeight:600,letterSpacing:"0.1em"}}>{node.slice}% equity</span>
                    {node.hours_estimate > 0 && <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.72)"}}>~{node.hours_estimate} hrs</span>}
                  </div>
                </div>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,padding:"6px 12px",color:node.status==="open"?"var(--ink)":node.status==="active"?"rgba(61,186,122,1)":"rgba(14,12,9,0.72)",background:node.status==="open"?"rgba(14,12,9,0.06)":node.status==="active"?"rgba(61,186,122,0.1)":"transparent",border:node.status==="active"?"1px solid rgba(61,186,122,0.72)":"none"}}>{node.status}</span>
              </div>
              {node.description && <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",lineHeight:1.85,color:"rgba(14,12,9,0.72)",marginBottom:"14px",maxWidth:"540px"}}>{node.description}</p>}
              {node.milestone && (
                <div style={{padding:"12px 16px",background:"rgba(14,12,9,0.03)",borderLeft:"2px solid rgba(14,12,9,0.12)",marginBottom:"14px"}}>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.72)",display:"block",marginBottom:"4px",fontWeight:600}}>Milestone</span>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.6)"}}>{node.milestone}</span>
                </div>
              )}
              {node.skills_needed?.length > 0 && (
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
                  {node.skills_needed.map((s: string) => (
                    <span key={s} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",border:"1px solid rgba(14,12,9,0.12)",padding:"4px 10px",color:"rgba(14,12,9,0.70)"}}>{s}</span>
                  ))}
                </div>
              )}
              {node.status === "open" && <RequestButton nodeId={node.id} seedId={seed.id} />}
              {node.status === "active" && <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(61,186,122,0.8)",fontWeight:600}}>✓ Node filled</p>}
              {node.status === "active" && me && node.contributor_id === me.id && seed.github_repo && (
                <div style={{marginTop:"10px",padding:"10px 14px",background:"rgba(14,12,9,0.03)",borderLeft:"2px solid rgba(14,12,9,0.12)"}}>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.45)",fontWeight:600,display:"block",marginBottom:"4px"}}>Your branch</span>
                  <code style={{fontFamily:"'Courier New',monospace",fontSize:"13px",color:"var(--ink)",fontWeight:600}}>role/{node.role.toLowerCase().replace(/\s+/g,"-")}</code>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.45)",display:"block",marginTop:"4px"}}>Push your work here. Open a PR to main when your milestone is complete.</span>
                </div>
              )}
            </div>
          ))}
        </div>
	<SeedUpdates seedId={seed.id} isOriginator={false} hasSigned={agreementSigned ?? true} />
	{seed.github_repo && <CommitLog seedSlug={slug} />}

	{/* Seed chat */}
<div style={{marginTop:"64px"}}>
  <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
    Seed chat
  </p>
  <Chat seedId={seed.id} title={`${seed.title} team`} hasSigned={agreementSigned ?? true} />
</div>
      </section>
      {showAgreement && <AgreementModal seedSlug={slug} onClose={() => setShowAgreement(false)} />}
    </main>
  )
}