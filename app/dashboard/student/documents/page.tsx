import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/requests/status-badge";
import { getStudentRequests } from "@/features/requests/queries";
import { requireRole } from "@/lib/auth";

export default async function StudentDocumentsPage() {
  const { user } = await requireRole(["student"]);
  const requests = await getStudentRequests(user.id);
  const documentRequests = requests.filter((request) => request.request_type === "document");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="section-heading">Documents</h1>
        <p className="text-sm text-muted-foreground">Track all your document-related requests in one place.</p>
      </div>
      <Card className="border-indigo-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Document Requests</CardTitle>
          <Badge variant="secondary">{documentRequests.length} total</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No document requests found yet.
                  </TableCell>
                </TableRow>
              ) : (
                documentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="capitalize">{request.priority}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
