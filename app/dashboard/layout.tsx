import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ctx = await getCurrentProfile(true);
  if (!ctx) return null;

  return (
    <DashboardShell
      role={ctx.profile.role}
      fullName={ctx.profile.full_name}
      avatarUrl={ctx.profile.avatar_url}
    >
      {children}
    </DashboardShell>
  );
}
