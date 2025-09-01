import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema } from '../../utils/validators';
import { CreateGroupData } from '../../types/group.types';
import { useGroups } from '../../hooks/useGroups';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface CreateGroupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateGroupForm({ onSuccess, onCancel }: CreateGroupFormProps) {
  const { createGroup, isCreating, createError } = useGroups();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGroupData>({
    resolver: zodResolver(createGroupSchema),
  });

  const onSubmit = async (data: CreateGroupData) => {
    try {
      await createGroup(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Group creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Group</CardTitle>
        <CardDescription>
          Start a new group to share expenses with friends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {createError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {createError.message || 'Failed to create group. Please try again.'}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Office Lunch Group"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Brief description of the group"
              error={errors.description?.message}
              {...register('description')}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              loading={isCreating}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isCreating}
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
