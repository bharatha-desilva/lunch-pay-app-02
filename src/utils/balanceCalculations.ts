import { Expense, Balance } from '../types/expense.types';

/**
 * Calculate balances for all users in a group based on expenses
 * @param expenses Array of expenses for the group
 * @returns Array of user balances
 */
export function calculateBalances(expenses: Expense[]): Balance[] {
  const balanceMap = new Map<string, number>();

  // Process each expense
  expenses.forEach(expense => {
    const totalAmount = expense.amount;
    const paidBy = expense.paidBy;
    const participants = expense.participants || [];

    // The person who paid gets credited the full amount initially
    balanceMap.set(paidBy, (balanceMap.get(paidBy) || 0) + totalAmount);

    // Each participant owes their specific amount (or equal split if amount not specified)
    participants.forEach(participant => {
      const userId = participant.userId;
      const owedAmount = participant.amount || (totalAmount / participants.length);
      
      balanceMap.set(userId, (balanceMap.get(userId) || 0) - owedAmount);
    });
  });

  // Convert map to Balance array and filter out invalid entries
  return Array.from(balanceMap.entries())
    .filter(([userId]) => userId && userId !== 'undefined' && userId !== 'null')
    .map(([userId, amount]) => ({
      userId,
      amount: Math.round(amount * 100) / 100 // Round to 2 decimal places
    }));
}

/**
 * Calculate total balance for a specific user
 * @param balances Array of all balances
 * @param userId User ID to calculate balance for
 * @returns User's total balance (positive = owed, negative = owes)
 */
export function getUserBalance(balances: Balance[], userId: string): number {
  const userBalance = balances.find(b => b.userId === userId);
  return userBalance?.amount || 0;
}

/**
 * Calculate summary statistics for a user's balances
 * @param balance User's total balance
 * @returns Object with totalOwed and totalOwing
 */
export function calculateBalanceSummary(balance: number) {
  return {
    totalBalance: balance,
    totalOwed: Math.max(0, balance),
    totalOwing: Math.max(0, -balance)
  };
}
