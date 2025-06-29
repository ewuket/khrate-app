
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Calendar, MapPin, Percent, Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminGroupSession } from "@/types/admin";

interface AdminGroupsListProps {
  groupSessions: AdminGroupSession[];
  loading?: boolean;
}

const AdminGroupsList = ({ groupSessions, loading }: AdminGroupsListProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'active':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Group Sessions</CardTitle>
          <CardDescription>Loading group sessions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Sessions ({groupSessions.length})
        </CardTitle>
        <CardDescription>All group buying sessions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {groupSessions.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No group sessions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{session.name || 'Unnamed Group'}</h3>
                      <Badge variant={getStatusBadgeVariant(session.status)}>
                        {session.status}
                      </Badge>
                      {session.is_featured && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Featured
                        </Badge>
                      )}
                      {session.is_public && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Public
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Join Code:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {session.join_code}
                        </code>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{session.location || 'Not specified'}, {session.region || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span>{session.discount_percentage}% discount</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{session.member_count || 0}/{session.max_participants} members</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Min participants:</span>
                        <span>{session.min_participants}</span>
                      </div>
                      
                      {session.total_amount && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Total amount:</span>
                          <span>{formatCurrency(session.total_amount)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Order status:</span>
                        <Badge variant="outline" size="sm">
                          {session.order_status || 'collecting'}
                        </Badge>
                      </div>
                    </div>
                    
                    {session.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-sm">Admin Notes:</span>
                        <p className="text-sm text-gray-600 mt-1">{session.admin_notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminGroupsList;
