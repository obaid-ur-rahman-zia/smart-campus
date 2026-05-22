import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getAllProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [] as Profile[];
  return (data ?? []) as Profile[];
}
