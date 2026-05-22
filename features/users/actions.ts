"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema, roleUpdateSchema } from "@/features/users/schemas";
import type { ProfileUpdateInput, RoleUpdateInput } from "@/features/users/schemas";

export async function updateUserRole(payload: RoleUpdateInput) {
  const parsed = roleUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid role update payload." };
  }

  const ctx = await requireRole(["staff", "admin"]);
  const actorRole = ctx.profile.role;

  if (actorRole === "staff" && parsed.data.role === "admin") {
    return { error: "Staff users cannot assign admin role." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function updateMyProfile(payload: ProfileUpdateInput) {
  const parsed = profileUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile payload." };
  }

  const ctx = await requireRole(["student", "teacher", "staff", "admin"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      roll_number: parsed.data.rollNumber?.trim() || null,
      department: parsed.data.department?.trim() || null,
      bio: parsed.data.bio?.trim() || null,
      avatar_url: parsed.data.avatarUrl?.trim() || null,
    })
    .eq("id", ctx.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/student/settings");
  return { success: true };
}
