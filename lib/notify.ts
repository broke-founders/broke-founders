import { supabase } from "./supabase"

type NotifyParams = {
  user_id: string
  type: "node_request"|"node_approved"|"node_rejected"|"seed_message"|"node_dropped"|"seed_graduated"
  title: string
  body?: string
  link?: string
}

export async function notify(params: NotifyParams) {
  await supabase.from("notifications").insert(params)
}