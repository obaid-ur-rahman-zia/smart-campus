"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookOpen, FileText, GraduationCap, LayoutDashboard, LogOut, Search, Settings, User, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

type DashboardShellProps = {
  children: React.ReactNode;
  role: UserRole;
  fullName: string;
  avatarUrl?: string | null;
};

const linksByRole: Record<UserRole, { label: string; href: string; icon: LucideIcon }[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "My Requests", href: "/dashboard/student/tracking", icon: FileText },
    { label: "Documents", href: "/dashboard/student/documents", icon: BookOpen },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
  teacher: [
    { label: "Teacher Panel", href: "/dashboard/staff", icon: LayoutDashboard },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
  staff: [
    { label: "Process Queue", href: "/dashboard/staff", icon: LayoutDashboard },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
  admin: [
    { label: "Control Panel", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "User Access", href: "/dashboard/admin/users", icon: User },
    { label: "System Logs", href: "/dashboard/admin/logs", icon: FileText },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
};

export function DashboardShell({ children, role, fullName, avatarUrl }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const settingsHref = "/dashboard/profile";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully.");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen w-full bg-[#fcfdfe] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        className="hidden w-72 flex-col border-r border-slate-200 bg-primary text-white md:flex"
        initial={{ x: -288 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-20 items-center gap-3 px-8">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-xl shadow-black/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <GraduationCap className="size-5" />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-black tracking-tight">Meridian</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institutional</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 pt-8">
          {linksByRole[role].map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                pathname === link.href
                  ? "bg-secondary text-white shadow-lg shadow-black/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: pathname === link.href ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <link.icon className={cn(
                  "size-5 transition-colors",
                  pathname === link.href ? "text-white" : "text-slate-500 group-hover:text-white"
                )} />
              </motion.div>
              {link.label}
              {pathname === link.href && (
                <motion.div
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6">
          <motion.div
            className="rounded-2xl bg-white/5 p-5 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar size="md" fallback={fullName.charAt(0)} className="bg-slate-200 text-primary">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : null}
              </Avatar>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-black text-white">{fullName}</p>
                <p className="text-[10px] font-bold uppercase text-slate-500">{role}</p>
              </div>
            </div>
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full justify-start h-10 px-3 text-xs font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-10">
          <div className="flex items-center gap-8 flex-1">
            <motion.div
              className="text-xs font-black uppercase tracking-widest text-slate-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Dashboard <span className="mx-2 text-slate-200">/</span>{" "}
              <span className="text-primary">{pathname.split('/').pop()}</span>
            </motion.div>

            <motion.div
              className="hidden max-w-md flex-1 lg:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Search services or requests..."
                  className="w-full h-11 rounded-xl bg-slate-50 pl-10 pr-4 text-sm font-bold border-transparent focus:bg-white focus:ring-2 focus:ring-primary/5 focus:border-slate-200 transition-all outline-none"
                />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link href={settingsHref} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xs">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  fullName.charAt(0)
                )}
              </div>
              <span className="text-sm font-black text-primary">{fullName.split(' ')[0]}</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href={settingsHref}>
                <Button size="icon" variant="ghost" className="rounded-full bg-slate-50 text-slate-500">
                  <Settings className="size-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </header>

        <motion.main
          className="flex-1 overflow-y-auto p-10 bg-[#fcfdfe]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          key={pathname}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
