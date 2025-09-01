import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { User } from '../../types/auth.types';

// Validation schema for settlements
const settlementSchema = z.object({
  fromUserId: z.string().min(1, 'Please select who is paying'),
  toUserId: z.string().min(1, 'Please select who is receiving payment'),
  amount: z.number().positive('Amount must be positive').max(10000, 'Amount too large'),
  description: z.string().max(200, 'Description too long').optional(),
}).refine((data) => data.fromUserId !== data.toUserId, {
  message: "Payer and receiver must be different people",
  path: ["toUserId"],
});

type SettlementFormData = z.infer<typeof settlementSchema>;

interface SettlementFormProps {
  groupId: string;
  groupMembers: User[];
  suggestedSettlements?: {
    fromUserId: string;
    toUserId: string;
    amount: number;
  }[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SettlementForm({ 
  groupId, 
  groupMembers, 
  suggestedSettlements = [],
  onSuccess, 
  onCancel 
}: SettlementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SettlementFormData>({
    resolver: zodResolver(settlementSchema),
  });

  const watchedFromUser = watch('fromUserId');
  const watchedToUser = watch('toUserId');
  const watchedAmount = watch('amount');

  const onSubmit = async (data: SettlementFormData) => {
    try {
      const settlementData = {
        groupId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        amount: data.amount,
        description: data.description || `Settlement payment`,
      };

      console.log('Would create settlement:', settlementData);
      // TODO: Implement actual settlement API call
      
      // Reset form and close modal on success
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Settlement creation failed:', error);
    }
  };

  // Apply suggested settlement
  const applySuggestion = (suggestion: { fromUserId: string; toUserId: string; amount: number }) => {
    setValue('fromUserId', suggestion.fromUserId);
    setValue('toUserId', suggestion.toUserId);
    setValue('amount', suggestion.amount);
    setValue('description', 'Suggested settlement');
  };

  // Get user name helper
  const getUserName = (userId: string) => {
    const user = groupMembers.find(m => m.id === userId);
    return user ? (user.name || user.email) : 'Unknown User';
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Record Settlement</CardTitle>
        <CardDescription>
          Record a payment between group members to settle debts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Suggested Settlements */}
        {suggestedSettlements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Settlements</h4>
            <div className="space-y-2">
              {suggestedSettlements.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="text-sm">
                    <span className="font-medium">{getUserName(suggestion.fromUserId)}</span>
                    <span className="text-gray-600"> pays </span>
                    <span className="font-medium">{getUserName(suggestion.toUserId)}</span>
                    <div className="text-blue-600 font-medium">
                      {formatCurrency(suggestion.amount)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion(suggestion)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fromUserId" className="block text-sm font-medium text-gray-700 mb-1">
              Who is paying?
            </label>
            <select
              id="fromUserId"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('fromUserId')}
            >
              <option value="">Select payer</option>
              {groupMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
            {errors.fromUserId && (
              <p className="mt-1 text-sm text-red-600">{errors.fromUserId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="toUserId" className="block text-sm font-medium text-gray-700 mb-1">
              Who is receiving payment?
            </label>
            <select
              id="toUserId"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('toUserId')}
            >
              <option value="">Select receiver</option>
              {groupMembers
                .filter(member => member.id !== watchedFromUser)
                .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
            {errors.toUserId && (
              <p className="mt-1 text-sm text-red-600">{errors.toUserId.message}</p>
            )}
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="e.g., Paid back for dinner"
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Settlement Preview */}
          {watchedFromUser && watchedToUser && watchedAmount && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-green-800">
                  <strong>{getUserName(watchedFromUser)}</strong> will pay{' '}
                  <strong>{formatCurrency(watchedAmount)}</strong> to{' '}
                  <strong>{getUserName(watchedToUser)}</strong>
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!watchedFromUser || !watchedToUser || !watchedAmount}
            >
              Record Settlement
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
