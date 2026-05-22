import { RoleManagementTable } from "@/components/users/role-management-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProfiles } from "@/features/users/queries";
import { requireRole } from "@/lib/auth";

export default async function AdminUsersPage() {
  const ctx = await requireRole(["admin"]);
  const profiles = await getAllProfiles();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="section-heading">User Access</h1>
        <p className="text-sm text-muted-foreground">Manage roles and permissions for all users.</p>
      </div>
      <Card className="border-indigo-100">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RoleManagementTable actorRole={ctx.profile.role} profiles={profiles} />
        </CardContent>
      </Card>
    </div>
  );
}
