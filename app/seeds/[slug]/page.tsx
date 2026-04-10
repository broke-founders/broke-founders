import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import SeedClient from "./SeedClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const { data: seed } = await supabase
    .from("seeds")
    .select("title, problem, slug")
    .eq("slug", slug)
    .single()

  if (!seed) {
    return { title: "Seed not found — Broke Founders" }
  }

  const title = `${seed.title} — Broke Founders`
  const description = (seed.problem || "").slice(0, 160)
  const url = `https://broke-founders.vercel.app/seeds/${seed.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: "https://broke-founders.vercel.app/og.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function SeedPage() {
  return <SeedClient />
}
