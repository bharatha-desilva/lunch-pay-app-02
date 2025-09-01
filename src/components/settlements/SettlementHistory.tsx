import { ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { formatDateTime } from '../../utils/formatters';
import { Settlement } from '../../types/expense.types';
import { User } from '../../types/auth.types';

interface SettlementHistoryProps {
  settlements: Settlement[];
  groupMembers: User[];
  isLoading?: boolean;
}

export function SettlementHistory({ settlements, groupMembers, isLoading = false }: SettlementHistoryProps) {
  // Get user name helper
  const getUserName = (userId: string) => {
    const user = groupMembers.find(m => m.id === userId);
    return user ? (user.name || user.email) : 'Unknown User';
  };

  // Get user initials for avatar
  const getUserInitials = (userId: string) => {
    const user = groupMembers.find(m => m.id === userId);
    const name = user ? (user.name || user.email) : 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
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
      <CardHeader>
        <CardTitle>Settlement History</CardTitle>
        <CardDescription>
          Recent payments recorded between group members
        </CardDescription>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No settlements yet</h3>
            <p className="text-gray-600">
              Settlements will appear here when group members record payments to each other.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((settlement) => (
              <div
                key={settlement.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* From User Avatar */}
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(settlement.fromUserId)}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-gray-400" />

                  {/* To User Avatar */}
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(settlement.toUserId)}
                    </span>
                  </div>

                  {/* Settlement Details */}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getUserName(settlement.fromUserId)} paid {getUserName(settlement.toUserId)}
                    </div>
                    {settlement.description && (
                      <div className="text-xs text-gray-500">{settlement.description}</div>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateTime(settlement.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(settlement.amount)}
                  </div>
                  <div className="text-xs text-gray-500">settled</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
