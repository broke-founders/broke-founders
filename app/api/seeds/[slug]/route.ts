import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Fetch seed
    const { data: seed, error: seedError } = await supabase
      .from("seeds")
      .select("*")
      .eq("slug", slug)
      .single()

    if (seedError || !seed) {
      return NextResponse.json(
        { error: "Seed not found", detail: seedError, slugReceived: slug },
        { status: 404 }
      )
      
    }

    // Fetch originator
    const { data: originator, error: userError } = await supabase
      .from("users")
      .select("github_username, github_avatar, name")
      .eq("id", seed.originator_id)
      .single()

    // Fetch nodes
    const { data: nodes, error: nodesError } = await supabase
      .from("nodes")
      .select("*")
      .eq("seed_id", seed.id)

    if (nodesError) {
      return NextResponse.json(
        { error: "Failed to fetch nodes", detail: nodesError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      seed: {
        ...seed,
        users: originator || null,
      },
      nodes: nodes || [],
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error", detail: err },
      { status: 500 }
    )
  }
}