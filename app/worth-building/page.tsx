export const dynamic = 'force-dynamic'

import Link from "next/link"

async function getData() {
  try {
    const [hnRes, githubRes] = await Promise.all([
      fetch("https://hacker-news.firebaseio.com/v0/showstories.json", { next: { revalidate: 3600 } }),
      fetch("https://api.github.com/search/repositories?q=created:>2026-03-01&sort=stars&order=desc&per_page=6", {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 }
      })
    ])

    const hnIds = await hnRes.json()
    const githubData = await githubRes.json()

    const hnStories = await Promise.all(
      hnIds.slice(0, 8).map(async (id: number) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return r.json()
      })
    )

    const hn = hnStories
      .filter((s: any) => s && s.title && s.score > 10)
      .slice(0, 5)
      .map((s: any) => ({
        title: s.title.replace(/^Show HN: /, ""),
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        points: s.score,
        comments: s.descendants || 0,
      }))

    const github = (githubData.items || []).slice(0, 5).map((r: any) => ({
      title: r.name.replace(/-/g, " "),
      url: r.html_url,
      points: r.stargazers_count,
      comments: r.forks_count,
      description: r.description,
      language: r.language,
    }))

    return { hn, github }
  } catch { return { hn: [], github: [] } }
}

export default async function WorthBuilding() {
  const data = await getData()

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
        <Link href="/" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",textDecoration:"none",fontWeight:600}}>← Home</Link>
        <Link href="/login" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",textDecoration:"none",fontWeight:600}}>Sign in</Link>
      </nav>

      <section style={{padding:"72px 48px 100px",maxWidth:"880px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--red)",marginBottom:"16px",fontWeight:700}}>
          Market signal
        </p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(40px,6vw,68px)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:"16px"}}>
          Worth building<br/>
          <em style={{fontWeight:400,color:"rgba(14,12,9,0.25)"}}>right now.</em>
        </h1>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",lineHeight:1.85,color:"rgba(14,12,9,0.6)",marginBottom:"64px",maxWidth:"480px"}}>
          What builders are actually shipping and what is getting traction. Updated every hour from Hacker News and GitHub.
        </p>

        {/* HN */}
        <div style={{marginBottom:"64px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",fontWeight:600}}>
              Show HN — What builders just shipped
            </p>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(192,57,43,0.7)",border:"1px solid rgba(192,57,43,0.3)",padding:"2px 8px",fontWeight:600}}>Live</span>
          </div>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
            {data.hn.length === 0 && (
              <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.4)",padding:"24px 0"}}>No signals right now.</p>
            )}
            {data.hn.map((item: any, i: number) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}>
                <div style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"grid",gridTemplateColumns:"1fr auto",gap:"24px",alignItems:"center"}}>
                  <div>
                    <span style={{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:700,display:"block",marginBottom:"4px",color:"rgba(14,12,9,0.92)"}}>{item.title}</span>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.4)"}}>
                      {item.points} points · {item.comments} comments
                    </span>
                  </div>
                  <span style={{color:"rgba(14,12,9,0.2)",fontSize:"16px"}}>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* GitHub */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",fontWeight:600}}>
              GitHub — Trending this month
            </p>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(61,186,122,0.8)",border:"1px solid rgba(61,186,122,0.3)",padding:"2px 8px",fontWeight:600}}>Live</span>
          </div>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
            {data.github.length === 0 && (
              <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.4)",padding:"24px 0"}}>No signals right now.</p>
            )}
            {data.github.map((item: any, i: number) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}>
                <div style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"grid",gridTemplateColumns:"1fr auto",gap:"24px",alignItems:"center"}}>
                  <div>
                    <span style={{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:700,display:"block",marginBottom:"4px",color:"rgba(14,12,9,0.92)"}}>{item.title}</span>
                    {item.description && (
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.55)",display:"block",marginBottom:"4px"}}>{item.description.slice(0,100)}{item.description.length>100?"...":""}</span>
                    )}
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.4)"}}>
                      ★ {item.points.toLocaleString()} · {item.language || "Unknown"}
                    </span>
                  </div>
                  <span style={{color:"rgba(14,12,9,0.2)",fontSize:"16px"}}>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{marginTop:"64px",paddingTop:"32px",borderTop:"1px solid rgba(14,12,9,0.08)"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.5)",marginBottom:"20px",lineHeight:1.8}}>
            See something worth building? Float a seed and find the team to build it with you.
          </p>
          <Link href="/login" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",padding:"13px 24px",textDecoration:"none",display:"inline-block"}}>
            Start building →
          </Link>
        </div>
      </section>
    </main>
  )
}