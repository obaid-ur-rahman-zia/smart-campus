"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateRequest } from "@/features/requests/actions";
import { StatusBadge } from "@/components/requests/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ServiceRequest, RequestStatus } from "@/types/database";

const statuses: RequestStatus[] = ["pending", "in_review", "approved", "rejected", "resolved"];

export function AdminRequestTable({ requests }: { requests: ServiceRequest[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStatus(id: string, status: RequestStatus) {
    startTransition(async () => {
      const result = await updateRequest({ id, status });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Request updated.");
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="capitalize">{request.request_type}</TableCell>
            <TableCell>{request.title}</TableCell>
            <TableCell>{request.category}</TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell className="capitalize">{request.priority}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    disabled={isPending || request.status === status}
                    onClick={() => handleStatus(request.id, status)}
                    size="sm"
                    variant={request.status === status ? "default" : "ghost"}
                  >
                    {status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
