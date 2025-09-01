import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatUserName, getInitials } from '../../utils/formatters';
import { Balance } from '../../types/expense.types';
import { User as UserType } from '../../types/auth.types';

interface BalanceListProps {
  balances: (Balance & { user: UserType })[];
  currentUserId: string;
  onSettle?: (userId: string, amount: number) => void;
  isLoading?: boolean;
}

export function BalanceList({ 
  balances, 
  currentUserId, 
  onSettle, 
  isLoading = false 
}: BalanceListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
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

  // Filter out current user and users with zero balance
  const relevantBalances = balances.filter(
    balance => balance.userId !== currentUserId && balance.amount !== 0
  );

  if (relevantBalances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <User className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 text-center">
              All settled up! No outstanding balances.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relevantBalances.map((balance) => {
            const isOwed = balance.amount > 0; // Positive means the current user is owed money
            const amount = Math.abs(balance.amount);
            
            return (
              <div
                key={balance.userId}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(formatUserName(balance.user))}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatUserName(balance.user)}
                    </p>
                    <p className={`text-xs ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                      {isOwed 
                        ? `owes you ${formatCurrency(amount)}`
                        : `you owe ${formatCurrency(amount)}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                    {isOwed ? '+' : '-'}{formatCurrency(amount)}
                  </span>
                  
                  {!isOwed && onSettle && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSettle(balance.userId, amount)}
                    >
                      Settle
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
