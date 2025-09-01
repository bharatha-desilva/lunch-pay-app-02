import { ArrowRight, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Balance } from '../../types/expense.types';
import { User } from '../../types/auth.types';

interface SettlementSuggestionsProps {
  balances: Balance[];
  groupMembers: User[];
  onRecordSettlement: (settlement: { fromUserId: string; toUserId: string; amount: number }) => void;
}

interface OptimalSettlement {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export function SettlementSuggestions({ 
  balances, 
  groupMembers, 
  onRecordSettlement 
}: SettlementSuggestionsProps) {
  
  // Calculate optimal settlements to minimize number of transactions
  const calculateOptimalSettlements = (): OptimalSettlement[] => {
    // Filter out zero balances and get debtors/creditors
    const nonZeroBalances = balances.filter(b => Math.abs(b.amount) > 0.01);
    
    const debtors = nonZeroBalances.filter(b => b.amount < 0).map(b => ({
      ...b,
      amount: Math.abs(b.amount) // Make positive for easier calculation
    }));
    
    const creditors = nonZeroBalances.filter(b => b.amount > 0);
    
    const settlements: OptimalSettlement[] = [];
    
    // Create copies to manipulate
    const debtorsCopy = [...debtors];
    const creditorsCopy = [...creditors];
    
    // Greedy algorithm to minimize settlements
    while (debtorsCopy.length > 0 && creditorsCopy.length > 0) {
      const debtor = debtorsCopy[0];
      const creditor = creditorsCopy[0];
      
      const settlementAmount = Math.min(debtor.amount, creditor.amount);
      
      if (settlementAmount > 0.01) { // Only create settlement if meaningful amount
        settlements.push({
          fromUserId: debtor.userId,
          toUserId: creditor.userId,
          amount: settlementAmount,
        });
      }
      
      // Update amounts
      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;
      
      // Remove if settled
      if (debtor.amount < 0.01) {
        debtorsCopy.shift();
      }
      if (creditor.amount < 0.01) {
        creditorsCopy.shift();
      }
    }
    
    return settlements;
  };

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

  const optimalSettlements = calculateOptimalSettlements();
  const totalDebt = balances
    .filter(b => b.amount < 0)
    .reduce((sum, b) => sum + Math.abs(b.amount), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span>Settlement Suggestions</span>
        </CardTitle>
        <CardDescription>
          Optimal way to settle all debts with minimum transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {optimalSettlements.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h3>
            <p className="text-gray-600">
              No settlements needed. Everyone is even with the group.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Optimization Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Total debt to settle: {formatCurrency(totalDebt)}</p>
                <p>• Recommended settlements: {optimalSettlements.length}</p>
                <p>• This minimizes the number of transactions needed</p>
              </div>
            </div>

            {/* Settlement List */}
            <div className="space-y-3">
              {optimalSettlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    {/* From User Avatar */}
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getUserInitials(settlement.fromUserId)}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-gray-400" />

                    {/* To User Avatar */}
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getUserInitials(settlement.toUserId)}
                      </span>
                    </div>

                    {/* Settlement Details */}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getUserName(settlement.fromUserId)} pays {getUserName(settlement.toUserId)}
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(settlement.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRecordSettlement(settlement)}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Record Payment
                  </Button>
                </div>
              ))}
            </div>

            {/* Action to record all */}
            {optimalSettlements.length > 1 && (
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-3">
                  Tip: Record settlements one by one as payments actually happen
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
