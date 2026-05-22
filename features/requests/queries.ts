import { createClient } from "@/lib/supabase/server";
import type { ServiceRequest } from "@/types/database";

export async function getStudentRequests(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [] as ServiceRequest[];
  return (data ?? []) as ServiceRequest[];
}

export async function getAllRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [] as ServiceRequest[];
  return (data ?? []) as ServiceRequest[];
}

export async function getRequestUpdates(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("request_updates")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
