import { supabase } from "@/lib/supabase"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: seed } = await supabase
    .from("seeds")
    .select("title, problem, stage")
    .eq("slug", slug)
    .single()

  if (!seed) return { title: "Seed · Broke Founders" }

  return {
    title: `${seed.title} · Broke Founders`,
    description: seed.problem?.slice(0, 160) || `A ${seed.stage} seed on Broke Founders.`,
    openGraph: {
      title: seed.title,
      description: seed.problem?.slice(0, 160),
      siteName: "Broke Founders",
    },
    twitter: {
      card: "summary",
      title: seed.title,
      description: seed.problem?.slice(0, 160),
    },
  }
}

export default function SeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
