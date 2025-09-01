import React, { memo, useMemo, useCallback } from 'react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Expense, Balance } from '../../types/expense.types';
import { User } from '../../types/auth.types';

// Optimized Expense Item Component
interface ExpenseItemProps {
  expense: Expense;
  onExpenseClick?: (expense: Expense) => void;
  groupMembers: User[];
}

export const OptimizedExpenseItem = memo(function ExpenseItem({
  expense,
  onExpenseClick,
  groupMembers,
}: ExpenseItemProps) {
  const handleClick = useCallback(() => {
    onExpenseClick?.(expense);
  }, [onExpenseClick, expense]);

  const paidByUser = useMemo(() => {
    return groupMembers.find(member => member.id === expense.paidBy);
  }, [groupMembers, expense.paidBy]);

  const categoryColor = useMemo(() => {
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
    return colorMap[expense.category.toLowerCase()] || '#6b7280';
  }, [expense.category]);

  return (
    <div
      onClick={handleClick}
      className={`p-4 border border-gray-200 rounded-lg transition-colors ${
        onExpenseClick ? 'hover:bg-gray-50 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <h4 className="font-medium text-gray-900">{expense.description}</h4>
          </div>
          
          <div className="text-sm text-gray-600">
            <div>Paid by {paidByUser?.name || paidByUser?.email || 'Unknown'}</div>
            <div>{formatDateTime(expense.createdAt)}</div>
            <div>{expense.participants.length} participant{expense.participants.length !== 1 ? 's' : ''}</div>
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
  );
});

// Optimized Balance Item Component
interface BalanceItemProps {
  balance: Balance;
  user: User;
  onSettleClick?: (balance: Balance) => void;
}

export const OptimizedBalanceItem = memo(function BalanceItem({
  balance,
  user,
  onSettleClick,
}: BalanceItemProps) {
  const handleSettleClick = useCallback(() => {
    onSettleClick?.(balance);
  }, [onSettleClick, balance]);

  const isPositive = balance.amount > 0;
  const isZero = Math.abs(balance.amount) < 0.01;

  const statusText = useMemo(() => {
    if (isZero) return 'Settled up';
    return isPositive ? 'Gets back' : 'Owes';
  }, [isPositive, isZero]);

  const statusColor = useMemo(() => {
    if (isZero) return 'text-gray-600';
    return isPositive ? 'text-green-600' : 'text-red-600';
  }, [isPositive, isZero]);

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {user.name || user.email}
          </div>
          <div className={`text-sm ${statusColor}`}>
            {statusText}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className={`font-semibold ${statusColor}`}>
          {isZero ? '—' : formatCurrency(Math.abs(balance.amount))}
        </div>
        {!isZero && onSettleClick && (
          <button
            onClick={handleSettleClick}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            Settle
          </button>
        )}
      </div>
    </div>
  );
});

// Optimized Member List Item
interface MemberItemProps {
  member: User;
  isCurrentUser: boolean;
  isAdmin: boolean;
  onRemove?: (userId: string) => void;
  showActions?: boolean;
}

export const OptimizedMemberItem = memo(function MemberItem({
  member,
  isCurrentUser,
  isAdmin,
  onRemove,
  showActions = true,
}: MemberItemProps) {
  const handleRemove = useCallback(() => {
    onRemove?.(member.id);
  }, [onRemove, member.id]);

  const displayName = useMemo(() => {
    return member.name || member.email;
  }, [member.name, member.email]);

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, [displayName]);

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {initials}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {displayName}
            {isCurrentUser && (
              <span className="text-xs text-gray-500 ml-2">(You)</span>
            )}
          </div>
          <div className="text-sm text-gray-600">{member.email}</div>
        </div>
      </div>
      
      {showActions && isAdmin && !isCurrentUser && onRemove && (
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      )}
    </div>
  );
});

// Optimized Group Card Component
interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    members?: User[];
  };
  onClick?: (groupId: string) => void;
  isSelected?: boolean;
}

export const OptimizedGroupCard = memo(function GroupCard({
  group,
  onClick,
  isSelected = false,
}: GroupCardProps) {
  const handleClick = useCallback(() => {
    onClick?.(group.id);
  }, [onClick, group.id]);

  const memberCount = useMemo(() => {
    return group.members?.length || 0;
  }, [group.members]);

  return (
    <div
      onClick={handleClick}
      className={`p-4 border rounded-lg transition-colors cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <h3 className="font-medium text-gray-900 mb-1">{group.name}</h3>
      {group.description && (
        <p className="text-sm text-gray-600 mb-2">{group.description}</p>
      )}
      <div className="text-xs text-gray-500">
        {memberCount} member{memberCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
});

// Performance utilities
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
