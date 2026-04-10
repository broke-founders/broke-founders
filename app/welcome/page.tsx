"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const SKILLS = {
  "Development": ["Frontend","Backend","Full Stack","Mobile","DevOps","Data Engineering","ML / AI","Blockchain"],
  "Design": ["UI / UX","Brand Identity","Motion","3D","Illustration","Product Design"],
  "Growth": ["SEO","Content Writing","Copywriting","Social Media","Community","Email Marketing","Paid Ads"],
  "Business": ["Product Management","Market Research","Sales","Finance","Legal Research","Operations"],
  "Domain Expert": ["Healthcare","Education","Fintech","Agriculture","Climate","Legal","Real Estate","Other"],
}

function WelcomeForm() {
  const params = useSearchParams()
  const token = params.get("token")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [custom, setCustom] = useState("")
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle")
  const [validToken, setValidToken] = useState(true)

  useEffect(() => {
    if (!token) setValidToken(false)
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) return
    setStatus("loading")
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, category, subcategory, custom_skill: custom })
    })
    if (res.ok) {
      setStatus("done")
    } else {
      setStatus("error")
    }
  }

  if (!validToken) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--paper)"}}>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.6)"}}>Invalid link.</p>
    </div>
  )

  if (status === "done") return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",background:"var(--paper)",padding:"48px"}}>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"#C0392B",marginBottom:"24px",fontWeight:600}}>
        You are in
      </p>
      <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(48px,8vw,88px)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:"28px",color:"#0E0C09"}}>
        Welcome to<br/>
        <em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>Broke Founders.</em>
      </h1>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"16px",lineHeight:1.85,color:"rgba(14,12,9,0.55)",maxWidth:"380px"}}>
        We have your skills on record. We will reach out personally when the platform is ready for you.
      </p>
    </div>
  )

  return (
    <div style={{minHeight:"100vh",background:"var(--paper)",padding:"80px 48px"}}>
      <div style={{maxWidth:"600px"}}>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"#C0392B",marginBottom:"36px",fontWeight:600}}>
          One more step
        </p>

        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(40px,6vw,64px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"16px",color:"#0E0C09"}}>
          What do you<br/>
          <em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>bring to the table?</em>
        </h1>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",lineHeight:1.85,color:"rgba(14,12,9,0.7)",marginBottom:"56px",maxWidth:"400px"}}>
          Tell us your skill. We will match you with seeds that need exactly what you have.
        </p>

        <form onSubmit={handleSubmit}>

          {/* CATEGORY */}
          <div style={{marginBottom:"24px"}}>
            <label style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.6)",display:"block",marginBottom:"10px"}}>
              Skill category
            </label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setSubcategory(""); setCustom(""); }}
              style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",color:"#0E0C09",fontFamily:"var(--font-sans)",fontSize:"15px",padding:"14px 16px",outline:"none",appearance:"none",cursor:"pointer"}}
            >
              <option value="">Select a category</option>
              {Object.keys(SKILLS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* SUBCATEGORY */}
          {category && (
            <div style={{marginBottom:"24px"}}>
              <label style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.6)",display:"block",marginBottom:"10px"}}>
                Specific skill
              </label>
              <select
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",color:"#0E0C09",fontFamily:"var(--font-sans)",fontSize:"15px",padding:"14px 16px",outline:"none",appearance:"none",cursor:"pointer"}}
              >
                <option value="">Select a skill</option>
                {SKILLS[category as keyof typeof SKILLS].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                <option value="other">Something else</option>
              </select>
            </div>
          )}

          {/* CUSTOM */}
          {subcategory === "other" && (
            <div style={{marginBottom:"24px"}}>
              <label style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.6)",display:"block",marginBottom:"10px"}}>
                Tell us your skill
              </label>
              <input
                type="text"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder="Describe what you do"
                style={{width:"100%",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",color:"#0E0C09",fontFamily:"var(--font-sans)",fontSize:"15px",padding:"14px 16px",outline:"none"}}
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!category || status === "loading"}
            style={{
              fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",
              textTransform:"uppercase",fontWeight:600,
              color:"#F5F1EA",background: category ? "#0E0C09" : "rgba(14,12,9,0.2)",
              padding:"15px 32px",border:"none",cursor: category ? "pointer" : "not-allowed",
              transition:"background 0.3s ease",
              marginTop:"16px",
            }}
          >
            {status === "loading" ? "Saving..." : "Submit my skill →"}
          </button>

          {status === "error" && (
            <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"#C0392B",marginTop:"16px"}}>
              Something went wrong. Try again.
            </p>
          )}

        </form>
      </div>
    </div>
  )
}

export default function Welcome() {
  return (
    <Suspense>
      <WelcomeForm />
    </Suspense>
  )
}