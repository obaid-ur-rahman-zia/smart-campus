import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export default async function DashboardHomePage() {
  const ctx = await getCurrentProfile(true);
  if (!ctx) return null;

  if (ctx.profile.role === "student") redirect("/dashboard/student");
  if (ctx.profile.role === "staff" || ctx.profile.role === "teacher") {
    redirect("/dashboard/staff");
  }
  redirect("/dashboard/admin");
}
