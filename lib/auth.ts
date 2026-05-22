import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

export async function getCurrentProfile(redirectToLogin = true) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("[auth] getCurrentProfile user:", user?.id ?? "none");

  if (!user) {
    if (redirectToLogin) {
      redirect("/login");
    }
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  let resolvedProfile = profile;
  console.log("[auth] profile found:", Boolean(resolvedProfile));
  if (!resolvedProfile) {
    const fallbackName =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Student User";
    const fallbackRollNumber = (user.user_metadata?.roll_number as string | undefined) ?? null;
    const fallbackDepartment = (user.user_metadata?.department as string | undefined) ?? null;

    const fallbackRole =
      user.user_metadata?.role === "admin" ||
      user.user_metadata?.role === "staff" ||
      user.user_metadata?.role === "teacher"
        ? user.user_metadata.role
        : "student";

    const { data: insertedProfile } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: fallbackName,
          roll_number: fallbackRollNumber,
          department: fallbackDepartment,
          bio: null,
          avatar_url: null,
          role: fallbackRole,
        },
        { onConflict: "id" },
      )
      .select("*")
      .single<Profile>();

    resolvedProfile =
      insertedProfile ??
      ({
        id: user.id,
        full_name: fallbackName,
        roll_number: fallbackRollNumber,
        department: fallbackDepartment,
        bio: null,
        avatar_url: null,
        role: fallbackRole,
        created_at: new Date().toISOString(),
      } satisfies Profile);
    console.log("[auth] profile fallback used:", Boolean(resolvedProfile));
  }

  return { user, profile: resolvedProfile };
}

export async function requireRole(roles: UserRole[]) {
  const ctx = await getCurrentProfile(true);
  if (!ctx) redirect("/login");
  if (!roles.includes(ctx.profile.role)) {
    redirect("/unauthorized");
  }
  return ctx;
}
