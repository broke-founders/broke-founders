"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  CATEGORIES, BACKGROUNDS, CURRENT_STATE, TARGET_MARKET,
  getSuggestions, adjustSlicesForStake, type SuggestedNode
} from "@/lib/wizard"
import { PaymentGate } from "@/components/PaymentGate"

type Node = SuggestedNode & { custom?: boolean }

export default function NewSeed() {
  const router = useRouter()

  // Step state
  const [step, setStep] = useState(1)

  // Step 1 — Idea
  const [title, setTitle] = useState("")
  const [problem, setProblem] = useState("")
  const [pitch, setPitch] = useState("")

  // Step 2 — Category
  const [category, setCategory] = useState("")

  // Step 3 — Background
  const [background, setBackground] = useState("")

  // Step 4 — Current state
  const [currentState, setCurrentState] = useState("")

  // Step 5 — Target market
  const [targetMarket, setTargetMarket] = useState("")

  // Step 6 — Nodes (auto-suggested, adjustable)
  const [nodes, setNodes] = useState<Node[]>([])
  const [stake, setStake] = useState(60)
  const [repo, setRepo] = useState("")
  const [threshold, setThreshold] = useState("")

  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle")
  const [error, setError] = useState("")
  const [pendingSeedId, setPendingSeedId] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const totalNodeSlices = nodes.reduce((s, n) => s + (n.slice || 0), 0)
  const remaining = 100 - stake - totalNodeSlices

  function goToNodes() {
    const suggested = getSuggestions(category, background)
    const adjusted = adjustSlicesForStake(suggested, stake)
    setNodes(adjusted)
    setStep(6)
  }

  function updateNode(i: number, field: keyof Node, value: any) {
    setNodes(prev => prev.map((n, idx) => idx === i ? {...n, [field]: value} : n))
  }

  function addNode() {
    if (nodes.length >= 6) return
    setNodes(prev => [...prev, {
      role: "", description: "", skills_needed: [], slice: 0,
      hours_estimate: 0, milestone: "", custom: true
    }])
  }

  function removeNode(i: number) {
    setNodes(prev => prev.filter((_, idx) => idx !== i))
  }

  async function submit() {
    if (remaining !== 0) { setError(`Slices must total 100%. You have ${remaining}% remaining.`); return }
    setStatus("loading")
    setError("")

    const res = await fetch("/api/seeds", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        title, problem: `${problem}\n\nPitch: ${pitch}\nTarget: ${targetMarket}\nStage: ${currentState}`,
        originator_stake: stake,
        graduation_threshold: threshold,
        github_repo: repo,
        nodes: nodes.map(n => ({
          ...n,
          skills_needed: typeof n.skills_needed === "string"
            ? (n.skills_needed as string).split(",").map((s:string) => s.trim()).filter(Boolean)
            : n.skills_needed,
        }))
      })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || "Something went wrong"); setStatus("error"); return }

    // Check if payment is required (second seed onwards)
    const countRes = await fetch("/api/seeds/mine/count")
    const countData = await countRes.json()

    if (countData.count > 1) {
      // This seed was just created — check if it needs payment
      if (!data.paid) {
        setPendingSeedId(data.id)
        setShowPayment(true)
        setStatus("idle")
        return
      }
    }

    router.push(`/seeds/${data.slug}`)
  }

  // Style helpers
  const label = (text: string) => (
    <div style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"10px",fontWeight:600}}>{text}</div>
  )

  const inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.15)",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:"15px",padding:"13px 16px",outline:"none",marginBottom:"20px",boxSizing:"border-box"}} />
  )

  const ta = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.15)",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:"15px",padding:"13px 16px",outline:"none",marginBottom:"20px",resize:"none",height:"110px",boxSizing:"border-box"}} />
  )

  const optionBtn = (value: string, selected: string, onSelect: (v: string) => void) => (
    <button key={value} onClick={() => onSelect(value)} style={{fontFamily:"var(--font-sans)",fontSize:"13px",padding:"12px 20px",border:`1px solid ${selected===value?"rgba(14,12,9,0.7)":"rgba(14,12,9,0.15)"}`,background:selected===value?"var(--ink)":"transparent",color:selected===value?"var(--paper)":"rgba(14,12,9,0.7)",cursor:"pointer",textAlign:"left",fontWeight:selected===value?600:400,transition:"all 0.15s ease"}}>
      {value}
    </button>
  )

  const nextBtn = (label: string, disabled: boolean, onClick: () => void) => (
    <button onClick={onClick} disabled={disabled} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:disabled?"rgba(14,12,9,0.2)":"var(--ink)",padding:"14px 32px",border:"none",cursor:disabled?"not-allowed":"pointer",marginTop:"8px"}}>
      {label} →
    </button>
  )

  const backBtn = () => (
    <button onClick={() => setStep(s => s-1)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.65)",background:"transparent",padding:"14px 24px",border:"1px solid rgba(14,12,9,0.15)",cursor:"pointer",marginTop:"8px",marginRight:"12px"}}>
      ← Back
    </button>
  )

  const STEPS = ["Idea","Category","Background","Current state","Market","Team","Float"]

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",textDecoration:"none",fontWeight:600}}>← Dashboard</Link>
        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          {STEPS.map((s, i) => (
            <div key={s} style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:step>i+1?"var(--ink)":step===i+1?"var(--red)":"rgba(14,12,9,0.15)"}}></div>
              {i < STEPS.length-1 && <div style={{width:16,height:1,background:"rgba(14,12,9,0.1)"}}></div>}
            </div>
          ))}
        </div>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"680px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"16px",fontWeight:600}}>
          Step {step} of {STEPS.length} — {STEPS[step-1]}
        </p>

        {/* STEP 1 — IDEA */}
        {step === 1 && (
          <div>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"40px"}}>
              What are you<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>building?</em>
            </h1>
            {label("Name your seed — 5 words or less")}
            {inp({ placeholder:"e.g. AI invoice tool for freelancers", value:title, onChange:e=>setTitle(e.target.value) })}
            {label("What problem does it solve?")}
            {ta({ placeholder:"Who hurts without this. What breaks today. Be specific.", value:problem, onChange:e=>setProblem(e.target.value) })}
            {label("One-line pitch")}
            {inp({ placeholder:"e.g. Stripe for freelance invoicing — automated, beautiful, fast", value:pitch, onChange:e=>setPitch(e.target.value) })}
            {nextBtn("Next", !title || !problem || !pitch, () => setStep(2))}
          </div>
        )}

        {/* STEP 2 — CATEGORY */}
        {step === 2 && (
          <div>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"40px"}}>
              What kind of<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>product?</em>
            </h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"8px",marginBottom:"32px"}}>
              {CATEGORIES.map(c => optionBtn(c, category, setCategory))}
            </div>
            {backBtn()}
            {nextBtn("Next", !category, () => setStep(3))}
          </div>
        )}

        {/* STEP 3 — BACKGROUND */}
        {step === 3 && (
          <div>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"16px"}}>
              What do you<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>bring?</em>
            </h1>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.6)",marginBottom:"32px",lineHeight:1.8}}>We will remove your role from the suggestions — you already have it covered.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"8px",marginBottom:"32px"}}>
              {BACKGROUNDS.map(b => optionBtn(b, background, setBackground))}
            </div>
            {backBtn()}
            {nextBtn("Next", !background, () => setStep(4))}
          </div>
        )}

        {/* STEP 4 — CURRENT STATE */}
        {step === 4 && (
          <div>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"40px"}}>
              Where are<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>you now?</em>
            </h1>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"8px",marginBottom:"32px"}}>
              {CURRENT_STATE.map(s => optionBtn(s, currentState, setCurrentState))}
            </div>
            {backBtn()}
            {nextBtn("Next", !currentState, () => setStep(5))}
          </div>
        )}

        {/* STEP 5 — TARGET MARKET */}
        {step === 5 && (
          <div>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"40px"}}>
              Who are you<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>building for?</em>
            </h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"8px",marginBottom:"32px"}}>
              {TARGET_MARKET.map(t => optionBtn(t, targetMarket, setTargetMarket))}
            </div>
            {backBtn()}
            {nextBtn("Build my team", !targetMarket, goToNodes)}
          </div>
        )}

        {/* STEP 6 — NODES + STAKE */}
        {step === 6 && (
          <div>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(32px,5vw,48px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"16px"}}>
              Your suggested<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>team.</em>
            </h1>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.6)",marginBottom:"40px",lineHeight:1.8}}>
              Based on a <strong>{category}</strong> built by a <strong>{background}</strong>. Adjust anything — slices, roles, milestones.
            </p>

            {/* Stake */}
            <div style={{padding:"20px 24px",background:"rgba(14,12,9,0.03)",border:"1px solid rgba(14,12,9,0.1)",marginBottom:"32px"}}>
              {label(`Your founding stake — ${stake}%`)}
              <input type="range" min={10} max={70} value={stake} onChange={e=>{setStake(Number(e.target.value))}} style={{width:"100%",accentColor:"var(--ink)",marginBottom:"8px"}} />
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.7)"}}>
                <span>10% min</span>
                <span style={{color:"var(--ink)",fontWeight:700}}>{stake}% yours · {100-stake}% for contributors</span>
                <span>70% max</span>
              </div>
            </div>

            {/* Slice counter */}
            <div style={{padding:"12px 20px",background:remaining===0?"rgba(14,12,9,0.03)":"rgba(192,57,43,0.06)",border:`1px solid ${remaining===0?"rgba(14,12,9,0.1)":"rgba(192,57,43,0.2)"}`,marginBottom:"28px",fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.7)"}}>
              Your stake: <strong>{stake}%</strong> · Node total: <strong>{totalNodeSlices}%</strong> · Remaining: <strong style={{color:remaining===0?"inherit":"var(--red)"}}>{remaining}%</strong>
            </div>

            {/* Nodes */}
            {nodes.map((node, i) => (
              <div key={i} style={{borderTop:"1px solid rgba(14,12,9,0.1)",paddingTop:"24px",marginBottom:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
                  <span style={{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:700}}>{node.custom ? "Custom node" : node.role}</span>
                  <button onClick={()=>removeNode(i)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--red)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Remove</button>
                </div>

                {node.custom && (
                  <>
                    {label("Role")}
                    {inp({ placeholder:"e.g. DevOps Engineer", value:node.role, onChange:e=>updateNode(i,"role",e.target.value) })}
                  </>
                )}

                {label("What they need to deliver")}
                {ta({ value:node.description, onChange:e=>updateNode(i,"description",e.target.value) })}

                {label("Skills needed (comma separated)")}
                {inp({ value:Array.isArray(node.skills_needed)?node.skills_needed.join(", "):node.skills_needed, onChange:e=>updateNode(i,"skills_needed",e.target.value as any) })}

                {label("Milestone deliverable")}
                {inp({ value:node.milestone, onChange:e=>updateNode(i,"milestone",e.target.value) })}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                  <div>
                    {label(`Equity slice — ${node.slice}%`)}
                    <input type="range" min={1} max={Math.max(1,100-stake-nodes.reduce((s,n,idx)=>idx===i?s:s+(n.slice||0),0))} value={node.slice} onChange={e=>updateNode(i,"slice",Number(e.target.value))} style={{width:"100%",accentColor:"var(--ink)",marginBottom:"20px"}} />
                  </div>
                  <div>
                    {label("Estimated hours")}
                    {inp({ type:"number", value:node.hours_estimate||"", onChange:e=>updateNode(i,"hours_estimate",Number(e.target.value)) })}
                  </div>
                </div>
              </div>
            ))}

            {nodes.length < 6 && (
              <button onClick={addNode} style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.7)",background:"none",border:"1px solid rgba(14,12,9,0.15)",padding:"10px 20px",cursor:"pointer",marginBottom:"32px",marginTop:"8px"}}>
                + Add another node
              </button>
            )}

            {/* Repo + threshold */}
            <div style={{borderTop:"1px solid rgba(14,12,9,0.1)",paddingTop:"28px",marginTop:"16px"}}>
              {label("GitHub repository (optional)")}
              {inp({ placeholder:"github.com/your-org/repo", value:repo, onChange:e=>setRepo(e.target.value) })}
              {label("Graduation threshold")}
              {inp({ placeholder:"e.g. 100 paying users, or first ₹10,000 revenue", value:threshold, onChange:e=>setThreshold(e.target.value) })}
            </div>

            {error && <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"var(--red)",marginBottom:"16px"}}>{error}</p>}

            {backBtn()}
            <button
              onClick={submit}
              disabled={status==="loading"||remaining!==0}
              style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:remaining===0?"var(--ink)":"rgba(14,12,9,0.2)",padding:"14px 32px",border:"none",cursor:remaining===0?"pointer":"not-allowed",marginTop:"8px"}}>
              {status==="loading" ? "Floating..." : "Float this seed →"}
            </button>
          </div>
        )}
      </section>

      {showPayment && pendingSeedId && (
        <PaymentGate
          seedId={pendingSeedId}
          onSuccess={() => { setShowPayment(false); router.push(`/seeds/${pendingSeedId}`) }}
          onCancel={() => { setShowPayment(false); setStatus("idle") }}
        />
      )}
    </main>
  )
}