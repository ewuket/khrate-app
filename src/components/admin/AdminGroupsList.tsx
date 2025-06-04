
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminGroupSession } from "@/types/admin";

interface AdminGroupsListProps {
  groupSessions: AdminGroupSession[];
}

const AdminGroupsList = ({ groupSessions }: AdminGroupsListProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Sessions</CardTitle>
        <CardDescription>Active group buying sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupSessions.slice(0, 10).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1">
                <p className="font-medium">{session.name || 'Unnamed Group'}</p>
                <p className="text-sm text-muted-foreground">
                  Code: {session.join_code} • {session.member_count} members
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(session.total_amount)} • {new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(session.status)}>
                  {session.status}
                </Badge>
                <Badge variant={getStatusBadgeVariant(session.order_status)}>
                  {session.order_status}
                </Badge>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {groupSessions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No group sessions found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGroupsList;
