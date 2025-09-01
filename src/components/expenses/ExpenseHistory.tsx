import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Calendar, DollarSign, Users, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Expense } from '../../types/expense.types';
import { User } from '../../types/auth.types';

interface ExpenseHistoryProps {
  expenses: Expense[];
  groupMembers: User[];
  isLoading?: boolean;
  onExpenseClick?: (expense: Expense) => void;
}

type SortField = 'date' | 'amount' | 'description' | 'paidBy';
type SortDirection = 'asc' | 'desc';

export function ExpenseHistory({ 
  expenses, 
  groupMembers, 
  isLoading = false,
  onExpenseClick 
}: ExpenseHistoryProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Get user name helper
  const getUserName = (userId: string) => {
    const user = groupMembers.find(m => m.id === userId);
    return user ? (user.name || user.email) : 'Unknown User';
  };

  // Get category color helper
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'food': '#f59e0b',
      'transport': '#3b82f6',
      'entertainment': '#8b5cf6',
      'shopping': '#ec4899',
      'groceries': '#10b981',
      'bills': '#ef4444',
      'travel': '#06b6d4',
      'health': '#f97316',
      'education': '#84cc16',
      'other': '#6b7280',
    };
    return colorMap[category.toLowerCase()] || '#6b7280';
  };

  // Sorting logic
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'paidBy':
          aValue = getUserName(a.paidBy).toLowerCase();
          bValue = getUserName(b.paidBy).toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, sortField, sortDirection, groupMembers]);

  // Pagination
  const totalPages = Math.ceil(sortedExpenses.length / pageSize);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
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
        <CardTitle>Expense History</CardTitle>
        <CardDescription>
          All expenses in this group ({expenses.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600">
              Create your first expense to start tracking group spending.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sort Controls */}
            <div className="flex flex-wrap gap-2 border-b pb-3">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              {[
                { field: 'date' as SortField, label: 'Date' },
                { field: 'amount' as SortField, label: 'Amount' },
                { field: 'description' as SortField, label: 'Description' },
                { field: 'paidBy' as SortField, label: 'Paid By' },
              ].map(({ field, label }) => (
                <Button
                  key={field}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort(field)}
                  className={`flex items-center space-x-1 ${
                    sortField === field ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <span>{label}</span>
                  <SortIcon field={field} />
                </Button>
              ))}
            </div>

            {/* Expense List */}
            <div className="space-y-3">
              {paginatedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => onExpenseClick?.(expense)}
                  className={`p-4 border border-gray-200 rounded-lg transition-colors ${
                    onExpenseClick ? 'hover:bg-gray-50 cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(expense.category) }}
                        />
                        <h4 className="font-medium text-gray-900">{expense.description}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(expense.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Paid by {getUserName(expense.paidBy)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{expense.participants.length} participant{expense.participants.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {expense.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedExpenses.length)} of {sortedExpenses.length} expenses
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="text-gray-400 mx-1">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
