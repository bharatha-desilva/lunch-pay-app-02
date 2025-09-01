import { Calendar, DollarSign, User, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency, formatDate, formatUserName } from '../../utils/formatters';
import { Expense } from '../../types/expense.types';
import { User as UserType } from '../../types/auth.types';

interface ExpenseListProps {
  expenses: Expense[];
  groupMembers?: UserType[];
  isLoading?: boolean;
}

export function ExpenseList({ expenses, groupMembers = [], isLoading = false }: ExpenseListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <DollarSign className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 text-center">
              No expenses yet. Add your first expense to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses
            .filter(expense => expense && expense.id && typeof expense.id === 'string')
            .map((expense, index) => {
            // Find the user who paid for this expense
            const paidByUser = groupMembers.find(member => member.id === expense.paidBy);
            
            return (
              <div
                key={expense.id || `expense-${index}`}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {String(expense.description || 'No description')}
                      </h3>
                      {expense.category && typeof expense.category === 'string' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          <Tag className="w-3 h-3 mr-1" />
                          {expense.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>
                          Paid by {paidByUser ? formatUserName(paidByUser) : 'Unknown User'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(expense.createdAt || new Date().toISOString())}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{Array.isArray(expense.participants) ? expense.participants.length : 0} people</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(Number(expense.amount) || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {expense.splitType === 'equal' ? 'Split equally' : 'Custom split'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
