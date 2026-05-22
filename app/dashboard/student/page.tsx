import Link from "next/link";
import { CircleCheckBig, FileClock, MessageSquareWarning, ReceiptText, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { RequestForm } from "@/components/requests/request-form";
import { StatusBadge } from "@/components/requests/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getStudentRequests } from "@/features/requests/queries";
import { requireRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function StudentDashboardPage() {
  const { user, profile } = await requireRole(["student"]);
  const fullName = profile.full_name;
  const requests = await getStudentRequests(user.id);

  const pending = requests.filter((r) => r.status === "pending").length;
  const inReview = requests.filter((r) => r.status === "in_review").length;
  const completed = requests.filter((r) => r.status === "resolved").length;
  const complaints = requests.filter((r) => r.request_type === "complaint").length;
  const completionRate = requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;

  return (
    <div className="max-w-7xl space-y-12">
      {/* Top Banner / Greeting */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-primary/95 to-secondary px-10 py-12 text-white shadow-2xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Welcome Back</p>
            <h1 className="text-4xl font-black tracking-tight">Hi, {fullName.split(" ")[0]}!</h1>
            <p className="text-lg font-medium text-slate-300">
              Your academic journey is looking great. You have{" "}
              <span className="font-black text-secondary">{pending} pending</span> request updates.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#new-service-request">
              <Button className="h-12 rounded-xl bg-secondary px-6 font-black text-white hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                <Sparkles className="mr-2 size-5" />
                New Service Request
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Complaints", value: complaints, icon: MessageSquareWarning, color: "text-amber-600", bg: "bg-amber-50", border: "border-l-amber-500", trend: "-12%" },
          { label: "Completion Rate", value: `${completionRate}%`, icon: CircleCheckBig, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-l-emerald-500", trend: "+8%" },
          { label: "Pending Workflow", value: pending, icon: FileClock, color: "text-blue-600", bg: "bg-blue-50", border: "border-l-blue-500", trend: "-3" },
          { label: "Digital Docs", value: inReview, icon: ReceiptText, color: "text-primary", bg: "bg-slate-50", border: "border-l-primary", trend: "+2" }
        ].map((stat, i) => (
          <div key={i} className={cn(
            "group relative overflow-hidden rounded-2xl border-l-[6px] bg-white p-8 shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl",
            stat.border
          )}>
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y--8 rounded-full bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-start justify-between">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("size-6", stat.color)} />
              </div>
              {stat.trend && (
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black",
                  stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  <TrendingUp className={cn("size-3", stat.trend.startsWith('+') ? "" : "rotate-180")} />
                  {stat.trend}
                </div>
              )}
            </div>
            <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-primary">{stat.value}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", stat.bg.replace('bg-', 'bg-').replace('-50', '-500'))}
                style={{ width: i === 1 ? `${completionRate}%` : i === 0 ? '40%' : '70%' }}
              />
            </div>
          </div>
        ))}
      </section>

      <section id="new-service-request" className="scroll-mt-24">
        <RequestForm />
      </section>

      {/* Main Grid */}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-white px-8 py-6">
              <div>
                <CardTitle className="text-2xl font-black text-primary uppercase tracking-tight">Academic Workflow History</CardTitle>
                <p className="mt-1 text-sm font-bold text-slate-400">Track all your service requests and their status</p>
              </div>
              <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 px-4 font-black transition-all hover:bg-slate-50">
                Export Data
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Request Detail</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase tracking-widest text-slate-400">Timestamp</TableHead>
                    <TableHead className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                    <TableHead className="pr-8 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FileClock className="size-12 text-slate-300" />
                          <p className="text-sm font-bold text-slate-400">No requests yet. Create your first service request!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.slice(0, 6).map((request) => (
                      <TableRow key={request.id} className="group transition-colors hover:bg-slate-50/70 border-slate-50">
                        <TableCell className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-primary leading-none">{request.title}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{request.request_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="text-sm font-bold text-slate-500">
                            {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <StatusBadge status={request.status} />
                        </TableCell>
                        <TableCell className="pr-8 py-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-full p-0 font-black text-secondary transition-all hover:bg-secondary hover:text-white hover:scale-110"
                          >
                            <ArrowRight className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Announcements */}
        <div className="space-y-10">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-2xl shadow-secondary/20">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
            <CardContent className="p-10 relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-2xl font-black leading-tight italic">Enroll for Global Exchange 2025</h3>
              <p className="mt-4 font-bold text-slate-100 leading-relaxed opacity-90">
                Applications for the international student exchange program are now being accepted.
                Check your eligibility.
              </p>
              <Button className="mt-10 w-full h-14 rounded-2xl bg-white font-black text-secondary hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <FileClock className="size-4" />
              Submission Deadlines
            </h4>
            <div className="space-y-4">
              {[
                { date: "28 OCT", title: "Semester Document Verification", color: "border-l-primary", dept: "Dept Verification Office" },
                { date: "02 NOV", title: "Transcript Issuance Request", color: "border-l-secondary", dept: "Registrar Block" },
                { date: "15 NOV", title: "Final Year Certificate", color: "border-l-amber-500", dept: "Academic Affairs" }
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "group flex items-center gap-6 rounded-2xl border-l-4 bg-white px-6 py-5 shadow-sm transition-all hover:translate-x-2 hover:shadow-md",
                    item.color
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400">{item.date.split(' ')[1]}</span>
                    <span className="text-lg font-black text-primary leading-none">{item.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-primary leading-tight">{item.title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{item.dept}</p>
                  </div>
                  <ArrowRight className="size-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
