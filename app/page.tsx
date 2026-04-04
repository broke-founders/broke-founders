"use client"

export default function Home() {
  return (
    <main style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>

      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 32px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>
          Broke Founders
        </div>
        <a href="#join" className="btn-primary">Join the waitlist</a>
      </nav>

      <section style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"80px 32px",maxWidth:"900px",margin:"0 auto",width:"100%"}}>
        <p style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"32px"}}>
          For builders who are almost there
        </p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(44px,8vw,88px)",lineHeight:1.0,letterSpacing:"-0.02em",marginBottom:"32px"}}>
          Your idea deserves<br/>
          <em style={{color:"rgba(255,255,255,0.35)"}}>the right team.</em><br/>
          Not money.
        </h1>
        <p style={{fontFamily:"var(--font-mono)",fontSize:"13px",lineHeight:1.9,color:"rgba(255,255,255,0.35)",maxWidth:"480px",marginBottom:"48px"}}>
          Broke Founders is where skilled builders who are stuck find each other.
          No salaries. No equity negotiation. Declare your scope, join a seed,
          ship the product. Split what it earns.
        </p>
        <div style={{display:"flex",alignItems:"center",gap:"28px"}}>
          <a href="#join" className="btn-primary">Join the waitlist</a>
          <a href="#how" className="btn-ghost">How it works</a>
        </div>
      </section>

      <section style={{borderTop:"1px solid rgba(255,255,255,0.05)",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
        <div style={{padding:"40px 32px",borderRight:"1px solid rgba(255,255,255,0.05)"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"40px",display:"block",marginBottom:"8px"}}>$0</span>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)"}}>Capital required</span>
        </div>
        <div style={{padding:"40px 32px",borderRight:"1px solid rgba(255,255,255,0.05)"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"40px",display:"block",marginBottom:"8px"}}>Time</span>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)"}}>The only currency</span>
        </div>
        <div style={{padding:"40px 32px"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"40px",display:"block",marginBottom:"8px"}}>Equal</span>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)"}}>Split at graduation</span>
        </div>
      </section>

      <section id="how" style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"80px 32px",maxWidth:"900px",margin:"0 auto",width:"100%"}}>
        <p style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"56px"}}>
          How it works
        </p>
        <div style={{padding:"32px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"grid",gridTemplateColumns:"200px 1fr",gap:"32px"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"20px"}}>01 — Float</span>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"12px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>You have an idea and a skill. You have done your part. You need one or two specific people to cross the finish line. Float a seed.</p>
        </div>
        <div style={{padding:"32px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"grid",gridTemplateColumns:"200px 1fr",gap:"32px"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"20px"}}>02 — Define</span>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"12px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>Scope out exactly what needs to be built. Declare what each person gets. Everyone signs before work begins. No ambiguity.</p>
        </div>
        <div style={{padding:"32px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"grid",gridTemplateColumns:"200px 1fr",gap:"32px"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"20px"}}>03 — Build</span>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"12px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>Contributors join with their skills and free tools. Work happens on GitHub. Progress is real or it is not. No faking it.</p>
        </div>
        <div style={{padding:"32px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"grid",gridTemplateColumns:"200px 1fr",gap:"32px"}}>
          <span style={{fontFamily:"var(--font-serif)",fontSize:"20px"}}>04 — Ship</span>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"12px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>When the product reaches real users, the seed graduates. Everyone who showed up owns their declared slice.</p>
        </div>
      </section>

      <section style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"80px 32px",background:"rgba(255,255,255,0.02)"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          <p style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"56px"}}>
            Who this is for
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"rgba(255,255,255,0.05)"}}>
            <div style={{padding:"40px 32px",background:"#0C0C0E"}}>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"20px",marginBottom:"16px"}}>The builder who is 70% there</h3>
              <p style={{fontFamily:"var(--font-mono)",fontSize:"11px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>You have started. You have skills. You hit a wall you cannot climb alone. This is built for you.</p>
            </div>
            <div style={{padding:"40px 32px",background:"#0C0C0E"}}>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"20px",marginBottom:"16px"}}>The specialist with no project</h3>
              <p style={{fontFamily:"var(--font-mono)",fontSize:"11px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>You are a designer, developer, marketer, writer with real skills and no outlet. Join a seed that needs exactly you.</p>
            </div>
            <div style={{padding:"40px 32px",background:"#0C0C0E"}}>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"20px",marginBottom:"16px"}}>The non-technical founder</h3>
              <p style={{fontFamily:"var(--font-mono)",fontSize:"11px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>You have the idea, the research, the domain knowledge. You just need builders who believe in the same thing.</p>
            </div>
            <div style={{padding:"40px 32px",background:"#0C0C0E"}}>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"20px",marginBottom:"16px"}}>The chronically almost-shipped</h3>
              <p style={{fontFamily:"var(--font-mono)",fontSize:"11px",lineHeight:1.9,color:"rgba(255,255,255,0.35)"}}>Your projects are almost done and never launched. A team with skin in the game changes that. We know. We are that person.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="join" style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"80px 32px",maxWidth:"900px",margin:"0 auto",width:"100%"}}>
        <p style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"24px"}}>
          Join the waitlist
        </p>
        <h2 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(32px,5vw,56px)",lineHeight:1.05,letterSpacing:"-0.02em",marginBottom:"20px"}}>
          We are building this<br/>
          <em style={{color:"rgba(255,255,255,0.35)"}}>right now.</em>
        </h2>
        <p style={{fontFamily:"var(--font-mono)",fontSize:"12px",color:"rgba(255,255,255,0.3)",lineHeight:1.9,marginBottom:"40px",maxWidth:"400px"}}>
          Leave your email. We will reach out personally when your spot is ready. No newsletters. No noise.
        </p>
        <form style={{display:"flex",gap:"8px",maxWidth:"480px"}} onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#E8E4DC",fontFamily:"var(--font-mono)",fontSize:"13px",padding:"14px 16px",outline:"none"}}
          />
          <button type="submit" className="btn-primary">Get early access</button>
        </form>
      </section>

      <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)"}}>
          Broke Founders
        </span>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"11px",color:"rgba(255,255,255,0.2)"}}>
          Broke builders. Real products. Shared upside.
        </span>
      </footer>

    </main>
  )
}