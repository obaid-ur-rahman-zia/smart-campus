import { StatusBadge } from "@/components/requests/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStudentRequests } from "@/features/requests/queries";
import { requireRole } from "@/lib/auth";

export default async function TrackingPage() {
  const { user } = await requireRole(["student"]);
  const requests = await getStudentRequests(user.id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="section-heading">Request Tracking</h1>
        <p className="text-sm text-muted-foreground">Track the status and history of each submission.</p>
      </div>
      <Card className="border-indigo-100">
        <CardHeader><CardTitle>All Requests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{request.request_type}</TableCell>
                  <TableCell>{request.title}</TableCell>
                  <TableCell><StatusBadge status={request.status} /></TableCell>
                  <TableCell className="capitalize">{request.priority}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
