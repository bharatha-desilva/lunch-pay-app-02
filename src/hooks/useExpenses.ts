import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import expensesService from '../services/expenses.service';
import { 
  Expense, 
  CreateExpenseData, 
  Category, 
  Balance, 
  Settlement 
} from '../types/expense.types';
import { QueryParams } from '../types/api.types';

export function useExpenses(groupId?: string, params?: QueryParams) {
  const queryClient = useQueryClient();

  // Fetch expenses
  const expensesQuery = useQuery({
    queryKey: ['expenses', groupId, params],
    queryFn: () => expensesService.getExpenses(groupId, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpenseData) => expensesService.createExpense(data),
    onSuccess: (newExpense) => {
      // Add to the expenses list
      queryClient.setQueryData<Expense[]>(['expenses', groupId], (old) =>
        old ? [newExpense, ...old] : [newExpense]
      );
      // Invalidate balances since they depend on expenses
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: (data: Partial<Expense> & { id: string }) => 
      expensesService.updateExpense(data),
    onSuccess: (updatedExpense) => {
      // Update the expense in the list
      queryClient.setQueryData<Expense[]>(['expenses', groupId], (old) =>
        old ? old.map(expense => 
          expense.id === updatedExpense.id ? updatedExpense : expense
        ) : [updatedExpense]
      );
      // Update single expense query
      queryClient.setQueryData(['expenses', updatedExpense.id], updatedExpense);
      // Invalidate balances
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => expensesService.deleteExpense(expenseId),
    onSuccess: (_, expenseId) => {
      // Remove the expense from the list
      queryClient.setQueryData<Expense[]>(['expenses', groupId], (old) =>
        old ? old.filter(expense => expense.id !== expenseId) : []
      );
      // Remove single expense query
      queryClient.removeQueries({ queryKey: ['expenses', expenseId] });
      // Invalidate balances
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
    },
  });

  return {
    expenses: expensesQuery.data || [],
    isLoading: expensesQuery.isLoading,
    error: expensesQuery.error,
    
    // Mutations
    createExpense: createExpenseMutation.mutateAsync,
    updateExpense: updateExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutateAsync,
    
    // Mutation states
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
    
    // Error states
    createError: createExpenseMutation.error,
    updateError: updateExpenseMutation.error,
    deleteError: deleteExpenseMutation.error,
    
    refetch: expensesQuery.refetch,
  };
}

export function useExpense(expenseId: string) {
  return useQuery({
    queryKey: ['expenses', expenseId],
    queryFn: () => expensesService.getExpenseById(expenseId),
    enabled: !!expenseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBalances(groupId: string) {
  const queryClient = useQueryClient();

  const balancesQuery = useQuery({
    queryKey: ['balances', groupId],
    queryFn: () => expensesService.getBalances(groupId),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  return {
    balances: balancesQuery.data || [],
    isLoading: balancesQuery.isLoading,
    error: balancesQuery.error,
    refetch: balancesQuery.refetch,
  };
}

export function useCategories() {
  const queryClient = useQueryClient();

  // Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => expensesService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: Partial<Category>) => expensesService.createCategory(data),
    onSuccess: (newCategory) => {
      // Add to categories list
      queryClient.setQueryData<Category[]>(['categories'], (old) =>
        old ? [...old, newCategory] : [newCategory]
      );
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,
    
    refetch: categoriesQuery.refetch,
  };
}

export function useSettlements(groupId?: string) {
  const queryClient = useQueryClient();

  // Fetch settlements
  const settlementsQuery = useQuery({
    queryKey: ['settlements', groupId],
    queryFn: () => expensesService.getSettlements(groupId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create settlement mutation
  const createSettlementMutation = useMutation({
    mutationFn: (data: Partial<Settlement>) => 
      expensesService.createSettlement(data),
    onSuccess: (newSettlement) => {
      // Add to settlements list
      queryClient.setQueryData<Settlement[]>(['settlements', groupId], (old) =>
        old ? [newSettlement, ...old] : [newSettlement]
      );
      // Invalidate balances since settlements affect them
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
    },
  });

  // Delete settlement mutation
  const deleteSettlementMutation = useMutation({
    mutationFn: (settlementId: string) => 
      expensesService.deleteSettlement(settlementId),
    onSuccess: (_, settlementId) => {
      // Remove from settlements list
      queryClient.setQueryData<Settlement[]>(['settlements', groupId], (old) =>
        old ? old.filter(settlement => settlement.id !== settlementId) : []
      );
      // Invalidate balances
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
    },
  });

  return {
    settlements: settlementsQuery.data || [],
    isLoading: settlementsQuery.isLoading,
    error: settlementsQuery.error,
    
    createSettlement: createSettlementMutation.mutateAsync,
    deleteSettlement: deleteSettlementMutation.mutateAsync,
    
    isCreating: createSettlementMutation.isPending,
    isDeleting: deleteSettlementMutation.isPending,
    
    createError: createSettlementMutation.error,
    deleteError: deleteSettlementMutation.error,
    
    refetch: settlementsQuery.refetch,
  };
}

export function useExpenseSearch(groupId: string) {
  const searchMutation = useMutation({
    mutationFn: (query: string) => expensesService.searchExpenses(groupId, query),
  });

  return {
    searchExpenses: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    searchError: searchMutation.error,
    searchResults: searchMutation.data || [],
  };
}
