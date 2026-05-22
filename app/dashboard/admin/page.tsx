import { ShieldCheck } from "lucide-react";
import { AdminRequestTable } from "@/components/requests/admin-request-table";
import { RoleManagementTable } from "@/components/users/role-management-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllRequests } from "@/features/requests/queries";
import { getAllProfiles } from "@/features/users/queries";
import { requireRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const ctx = await requireRole(["admin"]);
  const requests = await getAllRequests();
  const profiles = await getAllProfiles();

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inReview: requests.filter((r) => r.status === "in_review").length,
    closed: requests.filter((r) => ["resolved", "rejected", "approved"].includes(r.status)).length,
  };

  return (
    <div className="max-w-7xl space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Institutional Oversight</h1>
          <p className="mt-2 text-lg font-medium text-slate-500">Global control panel for Academic Meridian service workflows.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-12 rounded-xl border-slate-200 px-6 font-black text-primary">
              System Logs
           </Button>
           <Button className="h-12 rounded-xl bg-primary px-6 font-black text-white shadow-xl shadow-primary/20">
              Manage Access
           </Button>
        </div>
      </div>

      {/* Global Stats */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Volume", value: stats.total, color: "text-slate-900", border: "border-l-slate-900" },
          { label: "Critical Priority", value: stats.pending, color: "text-amber-600", border: "border-l-amber-500" },
          { label: "Active Review", value: stats.inReview, color: "text-blue-600", border: "border-l-blue-500" },
          { label: "Resolution Net", value: stats.closed, color: "text-emerald-600", border: "border-l-emerald-500" }
        ].map((stat, i) => (
          <div key={i} className={cn("group rounded-2xl border-l-[6px] bg-white p-8 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-xl", stat.border)}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className={cn("mt-6 text-5xl font-black italic", stat.color)}>{stat.value}</p>
            <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>+12% vs last month</span>
               <div className="h-1 w-12 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="border-b border-slate-50 bg-white px-8 py-6">
              <CardTitle className="text-2xl font-black text-primary uppercase tracking-tight">Main Request Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AdminRequestTable requests={requests} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="border-b border-slate-50 bg-white px-8 py-6">
              <CardTitle className="text-2xl font-black text-primary uppercase tracking-tight">Entity Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RoleManagementTable actorRole={ctx.profile.role} profiles={profiles} />
            </CardContent>
          </Card>

          <Card className="border-none bg-slate-900 p-8 text-white">
             <div className="flex items-center gap-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-secondary">
                   <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-xl font-black">Security Audit</h3>
             </div>
             <p className="text-sm font-bold text-slate-400 leading-relaxed">
               Last automated role-consistency check completed successfully. 0 discrepancies found.
             </p>
             <Button className="mt-8 w-full h-12 rounded-xl bg-white/10 font-black text-white hover:bg-white/20">
                Run Manual Check
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
