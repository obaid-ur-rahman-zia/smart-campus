"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { requestSchema, updateRequestSchema } from "@/features/requests/schemas";
import type { RequestInput, UpdateRequestInput } from "@/features/requests/schemas";

export async function createRequest(payload: RequestInput) {
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid request payload." };
  }

  const { user } = await requireRole(["student"]);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      ...parsed.data,
      user_id: user.id,
      status: "pending",
      admin_note: null,
      assigned_to: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to create request." };
  }

  await supabase.from("request_updates").insert({
    request_id: data.id,
    actor_id: user.id,
    message: "Request submitted by student.",
    status: "pending",
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/tracking");
  return { success: true };
}

export async function updateRequest(payload: UpdateRequestInput) {
  const parsed = updateRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid update payload." };
  }

  const { user } = await requireRole(["admin", "staff", "teacher"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("service_requests")
    .update({
      status: parsed.data.status,
      admin_note: parsed.data.admin_note ?? null,
      assigned_to: user.id,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  await supabase.from("request_updates").insert({
    request_id: parsed.data.id,
    actor_id: user.id,
    message: parsed.data.admin_note || "Request status updated.",
    status: parsed.data.status,
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard/student/tracking");
  return { success: true };
}
