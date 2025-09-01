import { BaseEntity } from './api.types';

export interface ExpenseParticipant {
  userId: string;
  amount: number;
  percentage?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  amount: number;
  description: string;
  category: string;
  paidBy: string;
  participants: ExpenseParticipant[];
  splitType: 'equal' | 'unequal';
  createdAt: string;
}

export interface CreateExpenseData {
  groupId: string;
  amount: number;
  description: string;
  category: string;
  paidBy: string;
  participants: ExpenseParticipant[];
  splitType: 'equal' | 'unequal';
  customSplits?: { userId: string; amount: number }[];
}

export interface Category extends BaseEntity {
  name: string;
  color?: string;
}

export interface Balance {
  userId: string;
  amount: number; // positive = owed to user, negative = user owes
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
  createdAt: string;
}
