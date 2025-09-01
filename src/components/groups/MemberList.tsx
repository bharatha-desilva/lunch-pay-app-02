import { User, UserPlus, UserMinus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatUserName, getInitials } from '../../utils/formatters';
import { User as UserType } from '../../types/auth.types';

interface MemberListProps {
  members: UserType[];
  currentUserId: string;
  isAdmin: boolean;
  onAddMember?: () => void;
  onRemoveMember?: (userId: string) => void;
  isLoading?: boolean;
}

export function MemberList({ 
  members, 
  currentUserId, 
  isAdmin, 
  onAddMember, 
  onRemoveMember, 
  isLoading = false 
}: MemberListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Members ({members?.length || 0})</CardTitle>
        {isAdmin && onAddMember && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAddMember}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(members || []).map((member) => {
            const isCurrentUser = member.id === currentUserId;
            
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(formatUserName(member))}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {formatUserName(member)}
                      </p>
                      {isCurrentUser && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isAdmin && !isCurrentUser && onRemoveMember && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
