import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types/database";

export function StatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { label: string; variant: "secondary" | "warning" | "success" | "destructive" | "default" }> = {
    pending: { label: "Pending", variant: "warning" },
    in_review: { label: "In Review", variant: "default" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
    resolved: { label: "Resolved", variant: "secondary" },
  };

  const item = map[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
