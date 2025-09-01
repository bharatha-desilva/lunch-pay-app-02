import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { useExpenses } from '../../hooks/useExpenses';
import { Category } from '../../types/expense.types';
import { formatCurrency } from '../../utils/formatters';
import { DEFAULT_CATEGORIES } from '../categories/CategoryManager';

// Validation schema
const expenseFormSchema = z.object({
  description: z.string().min(1, 'Description is required').max(100, 'Description too long'),
  amount: z.number().positive('Amount must be positive').max(10000, 'Amount too large'),
  category: z.string().min(1, 'Category is required'),
  paidBy: z.string().min(1, 'Payer is required'),
  participants: z.array(z.string()).min(1, 'At least one participant is required'),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  groupId: string;
  groupMembers: Array<{ id: string; name: string; email: string }>;
  categories?: Category[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExpenseForm({ 
  groupId, 
  groupMembers, 
  categories,
  onSuccess, 
  onCancel 
}: ExpenseFormProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'unequal' | 'percentage'>('equal');
  const [customAmounts, setCustomAmounts] = useState<{ [userId: string]: number }>({});
  const [customPercentages, setCustomPercentages] = useState<{ [userId: string]: number }>({});
  const { createExpense, isCreating } = useExpenses(groupId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      participants: [],
    },
  });

  const watchedAmount = watch('amount');
  
  // Calculate splits based on current split type
  const calculateSplitAmounts = (): { [userId: string]: number } => {
    const amount = watchedAmount || 0;
    
    switch (splitType) {
      case 'equal':
        return selectedParticipants.reduce((acc, userId) => ({
          ...acc,
          [userId]: selectedParticipants.length > 0 ? amount / selectedParticipants.length : 0
        }), {} as { [userId: string]: number });
        
      case 'unequal':
        return selectedParticipants.reduce((acc, userId) => ({
          ...acc,
          [userId]: customAmounts[userId] || 0
        }), {} as { [userId: string]: number });
        
      case 'percentage':
        return selectedParticipants.reduce((acc, userId) => ({
          ...acc,
          [userId]: amount * ((customPercentages[userId] || 0) / 100)
        }), {} as { [userId: string]: number });
        
      default:
        return {};
    }
  };
  
  const splitAmounts = calculateSplitAmounts();
  const totalAllocated = Object.values(splitAmounts).reduce((sum: number, amount: number) => sum + amount, 0);
  const remainingAmount = (watchedAmount || 0) - totalAllocated;
  const totalPercentage = Object.values(customPercentages).reduce((sum: number, pct: number) => sum + pct, 0);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Calculate participants based on current split amounts
      const participants = selectedParticipants.map(userId => ({
        userId,
        amount: splitAmounts[userId] || 0,
      }));

      const expenseData = {
        description: data.description,
        amount: data.amount,
        category: data.category,
        paidBy: data.paidBy,
        groupId,
        participants,
        splitType: splitType === 'percentage' ? 'unequal' : splitType, // Map percentage to unequal for API
      };

      await createExpense(expenseData);
      
      // Reset form and close modal on success
      reset();
      setSelectedParticipants([]);
      setSplitType('equal');
      onSuccess?.();
    } catch (error) {
      console.error('Expense creation failed:', error);
      // Error is handled by the useExpenses hook
    }
  };

  // Handle participant selection
  const toggleParticipant = (userId: string) => {
    const updated = selectedParticipants.includes(userId)
      ? selectedParticipants.filter(id => id !== userId)
      : [...selectedParticipants, userId];
    
    setSelectedParticipants(updated);
    setValue('participants', updated);
    
    // Clean up custom amounts/percentages when removing participants
    if (!updated.includes(userId)) {
      const newCustomAmounts = { ...customAmounts };
      const newCustomPercentages = { ...customPercentages };
      delete newCustomAmounts[userId];
      delete newCustomPercentages[userId];
      setCustomAmounts(newCustomAmounts);
      setCustomPercentages(newCustomPercentages);
    }
  };

  // Handle custom amount changes
  const updateCustomAmount = (userId: string, amount: number) => {
    setCustomAmounts(prev => ({
      ...prev,
      [userId]: Math.max(0, amount)
    }));
  };

  // Handle custom percentage changes
  const updateCustomPercentage = (userId: string, percentage: number) => {
    setCustomPercentages(prev => ({
      ...prev,
      [userId]: Math.max(0, Math.min(100, percentage))
    }));
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>
          Split an expense with your group members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Lunch at Tony's Pizza"
              error={errors.description?.message}
              {...register('description', { required: 'Description is required' })}
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount', { 
                valueAsNumber: true, 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select category</option>
              {(categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES).map((category) => (
                <option key={category.name} value={category.name.toLowerCase().replace(/\s+/g, '_')}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
              Paid by
            </label>
            <select
              id="paidBy"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('paidBy', { required: 'Please select who paid' })}
            >
              <option value="">Select who paid</option>
              {groupMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
            {errors.paidBy && (
              <p className="mt-1 text-sm text-red-600">{errors.paidBy.message}</p>
            )}
          </div>

          {/* Split Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split type
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'equal', label: 'Equal' },
                { value: 'unequal', label: 'Unequal' },
                { value: 'percentage', label: 'Percentage' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSplitType(option.value as 'equal' | 'unequal' | 'percentage')}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    splitType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split between
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded p-2">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(member.id)}
                      onChange={() => toggleParticipant(member.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{member.name || member.email}</span>
                  </label>
                  
                  {selectedParticipants.includes(member.id) && (
                    <div className="flex items-center space-x-2">
                      {splitType === 'equal' && (
                        <span className="text-xs text-gray-500">
                          {formatCurrency(splitAmounts[member.id] || 0)}
                        </span>
                      )}
                      
                      {splitType === 'unequal' && (
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={customAmounts[member.id] || ''}
                          onChange={(e) => updateCustomAmount(member.id, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      )}
                      
                      {splitType === 'percentage' && (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0"
                            value={customPercentages[member.id] || ''}
                            onChange={(e) => updateCustomPercentage(member.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">%</span>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(splitAmounts[member.id] || 0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.participants && (
              <p className="mt-1 text-sm text-red-600">{errors.participants.message}</p>
            )}
            {selectedParticipants.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Selected: {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''}
                  </span>
                  <span className="font-medium">
                    Total: {formatCurrency(totalAllocated)}
                  </span>
                </div>
                
                {splitType === 'unequal' && remainingAmount !== 0 && (
                  <div className={`mt-1 text-xs ${remainingAmount > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {remainingAmount > 0 
                      ? `${formatCurrency(remainingAmount)} remaining` 
                      : `${formatCurrency(Math.abs(remainingAmount))} over budget`}
                  </div>
                )}
                
                {splitType === 'percentage' && totalPercentage !== 100 && (
                  <div className={`mt-1 text-xs ${totalPercentage < 100 ? 'text-orange-600' : 'text-red-600'}`}>
                    {totalPercentage < 100 
                      ? `${(100 - totalPercentage).toFixed(1)}% remaining` 
                      : `${(totalPercentage - 100).toFixed(1)}% over 100%`}
                  </div>
                )}
                
                {splitType === 'equal' && (
                  <div className="mt-1 text-xs text-gray-500">
                    {formatCurrency(splitAmounts[selectedParticipants[0]] || 0)} per person
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                isCreating || 
                selectedParticipants.length === 0 ||
                (splitType === 'unequal' && Math.abs(remainingAmount) > 0.01) ||
                (splitType === 'percentage' && Math.abs(totalPercentage - 100) > 0.1)
              }
            >
              {isCreating ? 'Creating...' : 'Add Expense'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
