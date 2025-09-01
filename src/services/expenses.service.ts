import { createEntityApi } from './api';
import apiService from './api';
import { 
  Expense, 
  CreateExpenseData, 
  Category, 
  Balance, 
  Settlement 
} from '../types/expense.types';
import { QueryParams } from '../types/api.types';

// Use the generic entity API for basic CRUD operations
const expensesApi = createEntityApi<Expense>('expenses');
const categoriesApi = createEntityApi<Category>('categories');
const settlementsApi = createEntityApi<Settlement>('settlements');

class ExpensesService {
  // Expense CRUD operations
  async getExpenses(groupId?: string, params?: QueryParams) {
    const queryParams = groupId ? { ...params, group_id: groupId } : params;
    return expensesApi.getAll(queryParams);
  }

  async getExpenseById(id: string) {
    return expensesApi.getById(id);
  }

  async createExpense(data: CreateExpenseData) {
    return expensesApi.saveNew(data);
  }

  async updateExpense(data: Partial<Expense> & { id: string }) {
    return expensesApi.update(data);
  }

  async deleteExpense(id: string) {
    return expensesApi.delete(id);
  }

  // Balance operations
  async getBalances(groupId: string): Promise<Balance[]> {
    const response = await apiService.get<Balance[]>(`/groups/${groupId}/balances`);
    return response;
  }

  async getUserBalance(groupId: string, userId: string): Promise<Balance> {
    const response = await apiService.get<Balance>(
      `/groups/${groupId}/balances/${userId}`
    );
    return response;
  }

  // Settlement operations
  async getSettlements(groupId?: string) {
    const params = groupId ? { group_id: groupId } : undefined;
    return settlementsApi.getAll(params);
  }

  async createSettlement(data: Partial<Settlement>) {
    return settlementsApi.saveNew(data);
  }

  async deleteSettlement(id: string) {
    return settlementsApi.delete(id);
  }

  // Category operations
  async getCategories() {
    return categoriesApi.getAll();
  }

  async createCategory(data: Partial<Category>) {
    return categoriesApi.saveNew(data);
  }

  // Utility operations
  async searchExpenses(groupId: string, query: string): Promise<Expense[]> {
    const response = await apiService.get<Expense[]>('/expenses/search', {
      group_id: groupId,
      q: query,
    });
    return response;
  }

  // Calculate split amounts
  calculateEqualSplit(amount: number, participantCount: number): number {
    return Math.round((amount / participantCount) * 100) / 100;
  }

  validateCustomSplits(
    totalAmount: number, 
    splits: { userId: string; amount: number }[]
  ): boolean {
    const splitTotal = splits.reduce((sum, split) => sum + split.amount, 0);
    return Math.abs(splitTotal - totalAmount) < 0.01; // Allow for minor rounding differences
  }

  validatePercentageSplits(percentages: number[]): boolean {
    const total = percentages.reduce((sum, percentage) => sum + percentage, 0);
    return Math.abs(total - 100) < 0.01; // Allow for minor rounding differences
  }
}

const expensesService = new ExpensesService();
export default expensesService;
