import { AdminRequestTable } from "@/components/requests/admin-request-table";
import { RoleManagementTable } from "@/components/users/role-management-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRequests } from "@/features/requests/queries";
import { getAllProfiles } from "@/features/users/queries";
import { requireRole } from "@/lib/auth";

export default async function StaffDashboardPage() {
  const ctx = await requireRole(["staff", "teacher"]);
  const requests = await getAllRequests();
  const profiles = await getAllProfiles();
  const active = requests.filter((r) => ["pending", "in_review"].includes(r.status));

  return (
    <div className="max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Staff Operations</h1>
          <p className="mt-1 text-slate-500">Review and process institutional service requests and inquiries.</p>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-xl font-bold">Active Service Queue</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AdminRequestTable requests={active} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-xl font-bold">User Directory</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <RoleManagementTable actorRole={ctx.profile.role} profiles={profiles} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
