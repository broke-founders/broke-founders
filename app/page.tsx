"use client"

export default function Home() {
  return (
    <main style={{background:"var(--paper)",color:"var(--ink)"}}>

      {/* NAV */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)"}}>
        <div style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,color:"var(--muted)"}}>
          Broke Founders
        </div>
        <a href="#join" className="btn-primary">Join the waitlist</a>
      </nav>

      {/* HERO */}
      <section style={{padding:"120px 48px 100px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:"36px",fontWeight:600}}>
          For builders who are almost there
        </p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(56px,10vw,120px)",lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:"48px",fontWeight:900,maxWidth:"800px"}}>
          Your idea<br/>
          deserves<br/>
          <em style={{fontStyle:"italic",fontWeight:400,color:"var(--muted)"}}>the right</em><br/>
          <span style={{position:"relative",display:"inline-block"}}>
            team.
            <span style={{position:"absolute",bottom:"6px",left:0,right:0,height:"4px",background:"var(--red)"}}></span>
          </span>
        </h1>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"16px",lineHeight:1.8,color:"var(--muted)",maxWidth:"400px",marginBottom:"52px",fontWeight:400}}>
          No salaries. No equity negotiation.<br/>
          Declare your scope. Build together.<br/>
          Split what it earns.
        </p>
        <div style={{display:"flex",alignItems:"center",gap:"32px"}}>
          <a href="#join" className="btn-primary">Join the waitlist</a>
          <a href="#how" className="btn-ghost">How it works →</a>
        </div>
      </section>

      {/* DARK STATS STRIP */}
      <section style={{background:"var(--ink)",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
        <div style={{padding:"48px",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"52px",fontWeight:900,color:"var(--paper)",display:"block",marginBottom:"10px"}}>$0</span>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",fontWeight:500}}>Capital required</span>
        </div>
        <div style={{padding:"48px",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"52px",fontWeight:400,fontStyle:"italic",color:"var(--paper)",display:"block",marginBottom:"10px"}}>Time</span>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",fontWeight:500}}>The only currency</span>
        </div>
        <div style={{padding:"48px"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"52px",fontWeight:900,color:"var(--paper)",display:"block",marginBottom:"10px"}}>Equal</span>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",fontWeight:500}}>Split at graduation</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:"100px 48px",maxWidth:"960px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:"64px",fontWeight:600}}>
          The process
        </p>
        <div style={{borderTop:"1px solid var(--faint)"}}>
          {[
            ["01","Float","You have an idea and a skill. You hit a wall. You need one specific person to cross the finish line. Float a seed."],
            ["02","Define","Scope out what needs to be built. Declare what each person gets. Everyone signs before work begins. No ambiguity."],
            ["03","Build","Contributors join with their skills and free tools. Work happens on GitHub. Progress is real or it is not."],
            ["04","Ship","Product reaches real users. The seed graduates. Everyone who showed up owns their declared slice."],
          ].map(([num,title,desc]) => (
            <div key={num} style={{display:"grid",gridTemplateColumns:"60px 1fr",gap:"32px",padding:"44px 0",borderBottom:"1px solid var(--faint)",alignItems:"start"}}>
              <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"var(--red)",letterSpacing:"0.1em",fontWeight:600,paddingTop:"4px"}}>{num}</span>
              <div>
                <span style={{fontFamily:"var(--font-serif)",fontSize:"26px",fontWeight:700,display:"block",marginBottom:"12px"}}>{title}</span>
                <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",lineHeight:1.8,color:"var(--muted)",fontWeight:400}}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section style={{padding:"0 48px 100px",maxWidth:"960px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:"64px",fontWeight:600}}>
          Who this is for
        </p>
        <div style={{borderTop:"1px solid var(--faint)"}}>
          {[
            ["The builder who is 70% there","You have started. You have skills. You hit a wall you cannot climb alone. This is built for you."],
            ["The specialist with no project","You are a designer, developer, marketer, or writer with real skills and no outlet. Join a seed that needs exactly you."],
            ["The non-technical founder","You have the idea, the research, the domain knowledge. You just need builders who believe in the same thing."],
            ["The chronically almost-shipped","Your projects are almost done and never launched. A team with skin in the game changes that. We know. We are that person."],
          ].map(([title,desc]) => (
            <div key={title} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",padding:"44px 0",borderBottom:"1px solid var(--faint)",alignItems:"start"}}>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"24px",fontWeight:700,lineHeight:1.2}}>{title}</h3>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",lineHeight:1.8,color:"var(--muted)",fontWeight:400}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{padding:"72px 48px",borderTop:"1px solid var(--faint)",borderBottom:"1px solid var(--faint)"}}>
        <p style={{fontFamily:"var(--font-serif)",fontSize:"clamp(20px,3vw,32px)",fontWeight:400,fontStyle:"italic",color:"var(--muted)",lineHeight:1.5,maxWidth:"700px"}}>
          "We are not competing with anyone. This is community building. Broke people with skills deserve a chance. We give them that."
        </p>
      </section>

      {/* WAITLIST */}
      <section id="join" style={{background:"var(--ink)",padding:"100px 48px"}}>
        <div style={{maxWidth:"960px",margin:"0 auto"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:"28px",fontWeight:600}}>
            Join the waitlist
          </p>
          <h2 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(40px,7vw,80px)",fontWeight:900,color:"var(--paper)",lineHeight:1.0,letterSpacing:"-0.02em",marginBottom:"24px"}}>
            We are building<br/>
            <em style={{fontWeight:400,color:"rgba(255,255,255,0.3)"}}>this right now.</em>
          </h2>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(255,255,255,0.4)",lineHeight:1.8,marginBottom:"48px",maxWidth:"360px",fontWeight:400}}>
            Leave your email. We will reach out personally when your spot is ready. No newsletters. No noise.
          </p>
          <form
            style={{display:"flex",gap:"8px",maxWidth:"500px"}}
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const email = (form.elements.namedItem("email") as HTMLInputElement).value
              const btn = form.querySelector("button") as HTMLButtonElement
              btn.textContent = "Sending..."
              btn.disabled = true
              const res = await fetch("/api/waitlist",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email})
              })
              if(res.ok){
                btn.textContent = "You are in"
                form.reset()
              } else {
                btn.textContent = "Try again"
                btn.disabled = false
              }
            }}
          >
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"var(--paper)",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"14px 18px",outline:"none"}}
            />
            <button type="submit" className="btn-primary">Get early access</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"28px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid var(--faint)"}}>
        <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600}}>
          Broke Founders
        </span>
        <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"var(--muted)"}}>
          Broke builders. Real products. Shared upside.
        </span>
      </footer>

    </main>
  )
}