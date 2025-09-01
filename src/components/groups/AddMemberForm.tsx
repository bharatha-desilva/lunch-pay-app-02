import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberSchema } from '../../utils/validators';
import { AddMemberData } from '../../types/group.types';
import { useGroups } from '../../hooks/useGroups';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface AddMemberFormProps {
  groupId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddMemberForm({ groupId, onSuccess, onCancel }: AddMemberFormProps) {
  const { addMember, isAddingMember, addMemberError } = useGroups();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>({
    resolver: zodResolver(addMemberSchema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      const memberData: AddMemberData = {
        groupId,
        email: data.email,
      };
      
      await addMember(memberData);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Add member failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Member</CardTitle>
        <CardDescription>
          Invite someone to join this group by their email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {addMemberError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {addMemberError.message || 'Failed to add member. Please try again.'}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="friend@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <p className="mt-1 text-xs text-gray-500">
              They'll receive an invitation to join this group
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              loading={isAddingMember}
              disabled={isAddingMember}
            >
              {isAddingMember ? 'Adding...' : 'Add Member'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isAddingMember}
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
