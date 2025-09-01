import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatBalance, formatCurrency } from '../../utils/formatters';

interface BalanceSummaryProps {
  totalBalance: number;
  totalOwed: number;
  totalOwing: number;
  isLoading?: boolean;
}

export function BalanceSummary({ 
  totalBalance, 
  totalOwed, 
  totalOwing, 
  isLoading = false 
}: BalanceSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const balanceInfo = formatBalance(totalBalance);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balanceInfo.color}`}>
            {totalBalance === 0 ? 'Settled' : formatCurrency(Math.abs(totalBalance))}
          </div>
          <p className={`text-xs ${balanceInfo.color}`}>
            {balanceInfo.text}
          </p>
        </CardContent>
      </Card>

      {/* Amount You're Owed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">You are owed</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalOwed)}
          </div>
          <p className="text-xs text-green-600">
            money coming your way
          </p>
        </CardContent>
      </Card>

      {/* Amount You Owe */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">You owe</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalOwing)}
          </div>
          <p className="text-xs text-red-600">
            outstanding payments
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
