"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRole } from "@/features/users/actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Profile, UserRole } from "@/types/database";

const roleOptions: UserRole[] = ["student", "teacher", "staff", "admin"];

export function RoleManagementTable({
  profiles,
  actorRole,
}: {
  profiles: Profile[];
  actorRole: UserRole;
}) {
  const [pending, startTransition] = useTransition();
  const canEdit = actorRole === "staff" || actorRole === "admin";

  function onRoleChange(userId: string, role: UserRole) {
    startTransition(async () => {
      const result = await updateUserRole({ userId, role });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Role updated successfully.");
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Assign Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell className="font-medium">{profile.full_name}</TableCell>
            <TableCell className="font-mono text-xs text-slate-500">{profile.id}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {profile.role}
              </Badge>
            </TableCell>
            <TableCell>
              <select
                className="h-10 rounded-lg border border-indigo-100 bg-white px-3 text-sm capitalize"
                defaultValue={profile.role}
                disabled={pending || !canEdit}
                onChange={(event) => onRoleChange(profile.id, event.target.value as UserRole)}
              >
                {roleOptions
                  .filter((role) => !(actorRole === "staff" && role === "admin"))
                  .map((role) => (
                    <option className="capitalize" key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
