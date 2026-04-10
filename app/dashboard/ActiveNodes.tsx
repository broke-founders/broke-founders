"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function ActiveNodes() {
  const router = useRouter()
  const [nodes, setNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/nodes/mine")
      .then(r => r.json())
      .then(data => { setNodes(data.nodes || []); setLoading(false) })
  }, [])

  async function leave(nodeId: string) {
    if (!confirm("Are you sure? This will open the node for someone else.")) return
    await fetch("/api/nodes/requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node_id: nodeId })
    })
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    router.refresh()
  }

  if (loading || nodes.length === 0) return null

  return (
    <div style={{marginBottom:"48px"}}>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
        My active nodes — {nodes.length}
      </p>
      <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
        {nodes.map((node: any) => (
          <div key={node.id} style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.1)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",gap:"16px"}}>
            <div>
              <Link href={`/seeds/${node.seeds?.slug}`} style={{textDecoration:"none",color:"inherit"}}>
                <span style={{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:700,display:"block",marginBottom:"4px"}}>{node.role}</span>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.55)"}}>on <strong>{node.seeds?.title}</strong> · {node.slice}% equity</span>
              </Link>
            </div>
            <button
              onClick={() => leave(node.id)}
              style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.6)",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",padding:"8px 14px",cursor:"pointer"}}
            >
              Leave
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}