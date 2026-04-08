"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const ROLES = [
  "Frontend Developer","Backend Developer","Full Stack Developer",
  "Mobile Developer","DevOps Engineer","UI/UX Designer",
  "Brand Designer","Copywriter","Content Writer","SEO Specialist",
  "Social Media","Community Manager","Product Manager",
  "Market Researcher","Sales","Domain Expert","Other"
]

type Node = {
  role: string
  description: string
  skills_needed: string
  slice: number
  hours_estimate: number
  milestone: string
}

const emptyNode = (): Node => ({
  role: "", description: "", skills_needed: "",
  slice: 0, hours_estimate: 0, milestone: ""
})

export default function NewSeed() {
  const router = useRouter()
  const [repo, setRepo] = useState("")
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [problem, setProblem] = useState("")
  const [stake, setStake] = useState(60)
  const [threshold, setThreshold] = useState("")
  const [nodes, setNodes] = useState<Node[]>([emptyNode()])
  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle")
  const [error, setError] = useState("")

  const totalSlices = stake + nodes.reduce((s, n) => s + (n.slice || 0), 0)
  const remaining = 100 - totalSlices

  function updateNode(i: number, field: keyof Node, value: any) {
    setNodes(prev => prev.map((n, idx) => idx === i ? {...n, [field]: value} : n))
  }

  function addNode() {
    if (nodes.length < 6) setNodes(prev => [...prev, emptyNode()])
  }

  function removeNode(i: number) {
    if (nodes.length > 1) setNodes(prev => prev.filter((_, idx) => idx !== i))
  }

  async function submit() {
    if (totalSlices !== 100) { setError("Slices must total exactly 100%"); return }
    setStatus("loading")
    setError("")
    const res = await fetch("/api/seeds", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        title, problem,
        originator_stake: stake,
        graduation_threshold: threshold,
        nodes: nodes.map(n => ({
          ...n,
          skills_needed: n.skills_needed.split(",").map(s => s.trim()).filter(Boolean),
        }))
      })
    })
    const data = await res.json()
    if (res.ok) {
      router.push(`/seeds/${data.slug}`)
    } else {
      setError(data.error || "Something went wrong")
      setStatus("error")
    }
  }

  const label = (text: string) => (
    <div style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",marginBottom:"8px",fontWeight:600}}>
      {text}
    </div>
  )

  const input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"12px 14px",outline:"none",marginBottom:"20px"}} />
  )

  const textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"12px 14px",outline:"none",marginBottom:"20px",resize:"none",height:"100px"}} />
  )

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)"}}>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>
          ← Dashboard
        </Link>
        <div style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",color:"rgba(14,12,9,0.35)"}}>
          Step {step} of 3
        </div>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"680px"}}>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"20px",fontWeight:600}}>
          Float a seed
        </p>

        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"48px"}}>
          {step === 1 && "The idea"}
          {step === 2 && "Your stake"}
          {step === 3 && <>The <em style={{fontWeight:400,color:"rgba(14,12,9,0.3)"}}>nodes</em></>}
        </h1>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            {label("Name your seed")}
            {input({ placeholder:"Five words or less", value:title, onChange:e=>setTitle(e.target.value) })}

            {label("What problem does it solve?")}
            {textarea({ placeholder:"Who hurts without this. What breaks. Who uses it first.", value:problem, onChange:e=>setProblem(e.target.value) })}

            {label("Graduation threshold")}
            {label("GitHub repository (optional)")}
            {input({ placeholder:"github.com/your-org/repo", value:repo, onChange:e=>setRepo(e.target.value) })}
            {input({ placeholder:"e.g. 100 paying users, or first ₹10,000 revenue", value:threshold, onChange:e=>setThreshold(e.target.value) })}

            <button
              onClick={() => setStep(2)}
              disabled={!title || !problem}
              style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:title && problem ? "var(--ink)" : "rgba(14,12,9,0.2)",padding:"14px 28px",border:"none",cursor:title && problem ? "pointer" : "not-allowed"}}
            >
              Next →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",lineHeight:1.85,color:"rgba(14,12,9,0.5)",marginBottom:"36px"}}>
              Declare your founding stake. This is your slice of the product. Maximum 70%. Minimum 10%. The rest goes to your contributors.
            </p>

            {label(`Your stake — ${stake}%`)}
            <input
              type="range" min={10} max={70} value={stake}
              onChange={e => setStake(Number(e.target.value))}
              style={{width:"100%",marginBottom:"8px",accentColor:"var(--ink)"}}
            />
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.35)",marginBottom:"32px"}}>
              <span>10% min</span>
              <span style={{color:"var(--ink)",fontWeight:600}}>{stake}% yours</span>
              <span>70% max</span>
            </div>

            <div style={{padding:"20px",background:"rgba(14,12,9,0.04)",marginBottom:"32px"}}>
              <div style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.5)",lineHeight:1.8}}>
                <div>Your stake: <strong style={{color:"var(--ink)"}}>{stake}%</strong></div>
                <div>Available for contributors: <strong style={{color:"var(--ink)"}}>{100-stake}%</strong></div>
              </div>
            </div>

            <div style={{display:"flex",gap:"12px"}}>
              <button onClick={() => setStep(1)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.4)",background:"transparent",padding:"14px 28px",border:"1px solid rgba(14,12,9,0.12)",cursor:"pointer"}}>
                ← Back
              </button>
              <button onClick={() => setStep(3)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",padding:"14px 28px",border:"none",cursor:"pointer"}}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{padding:"16px 20px",background: remaining === 0 ? "rgba(14,12,9,0.04)" : "rgba(192,57,43,0.06)",border:`1px solid ${remaining === 0 ? "rgba(14,12,9,0.08)" : "rgba(192,57,43,0.2)"}`,marginBottom:"32px",fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.6)"}}>
              Your stake: <strong>{stake}%</strong> — Nodes: <strong>{nodes.reduce((s,n) => s+(n.slice||0),0)}%</strong> — Remaining: <strong style={{color: remaining === 0 ? "inherit" : "var(--red)"}}>{remaining}%</strong>
            </div>

            {nodes.map((node, i) => (
              <div key={i} style={{borderTop:"1px solid var(--faint)",paddingTop:"24px",marginBottom:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
                  <span style={{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:700}}>Node {i+1}</span>
                  {nodes.length > 1 && (
                    <button onClick={() => removeNode(i)} style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--red)",background:"none",border:"none",cursor:"pointer"}}>
                      Remove
                    </button>
                  )}
                </div>

                {label("Role")}
                <select
                  value={node.role}
                  onChange={e => updateNode(i, "role", e.target.value)}
                  style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"12px 14px",outline:"none",marginBottom:"20px",appearance:"none"}}
                >
                  <option value="">Select a role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {label("What they need to deliver")}
                {textarea({ placeholder:"Be specific. This becomes the scope.", value:node.description, onChange:e=>updateNode(i,"description",e.target.value) })}

                {label("Skills needed (comma separated)")}
                {input({ placeholder:"e.g. React, Node.js, PostgreSQL", value:node.skills_needed, onChange:e=>updateNode(i,"skills_needed",e.target.value) })}

                {label("Milestone deliverable")}
                {input({ placeholder:"e.g. Working auth system with tests", value:node.milestone, onChange:e=>updateNode(i,"milestone",e.target.value) })}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                  <div>
                    {label(`Equity slice — ${node.slice}%`)}
                    <input type="range" min={1} max={Math.max(1, 100-stake-nodes.reduce((s,n,idx)=>idx===i?s:s+(n.slice||0),0))} value={node.slice} onChange={e=>updateNode(i,"slice",Number(e.target.value))} style={{width:"100%",accentColor:"var(--ink)",marginBottom:"20px"}} />
                  </div>
                  <div>
                    {label("Estimated hours")}
                    {input({ type:"number", placeholder:"40", value:node.hours_estimate||"", onChange:e=>updateNode(i,"hours_estimate",Number(e.target.value)) })}
                  </div>
                </div>
              </div>
            ))}

            {nodes.length < 6 && (
              <button onClick={addNode} style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",background:"none",border:"1px solid rgba(14,12,9,0.12)",padding:"10px 20px",cursor:"pointer",marginBottom:"32px",marginTop:"8px"}}>
                + Add another node
              </button>
            )}

            {error && (
              <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"var(--red)",marginBottom:"16px"}}>{error}</p>
            )}

            <div style={{display:"flex",gap:"12px"}}>
              <button onClick={() => setStep(2)} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.4)",background:"transparent",padding:"14px 28px",border:"1px solid rgba(14,12,9,0.12)",cursor:"pointer"}}>
                ← Back
              </button>
              <button
                onClick={submit}
                disabled={status === "loading" || remaining !== 0}
                style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background: remaining === 0 ? "var(--ink)" : "rgba(14,12,9,0.2)",padding:"14px 28px",border:"none",cursor: remaining === 0 ? "pointer" : "not-allowed"}}
              >
                {status === "loading" ? "Floating..." : "Float this seed →"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}