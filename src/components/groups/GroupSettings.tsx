import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Users, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Group } from '../../types/group.types';
import { useGroups } from '../../hooks/useGroups';

// Validation schema for group updates
const groupUpdateSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
});

type GroupUpdateData = z.infer<typeof groupUpdateSchema>;

interface GroupSettingsProps {
  group: Group;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function GroupSettings({ group, onSuccess, onCancel }: GroupSettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>('general');
  const { updateGroup, deleteGroup, isUpdating, isDeleting } = useGroups();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GroupUpdateData>({
    resolver: zodResolver(groupUpdateSchema),
    defaultValues: {
      name: group.name,
      description: group.description || '',
    },
  });

  const onSubmitUpdate = async (data: GroupUpdateData) => {
    try {
      await updateGroup({
        id: group.id,
        ...data,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleDeleteGroup = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this group? This will permanently delete all expenses, balances, and member data. This action cannot be undone.'
    );

    if (confirmDelete) {
      const doubleConfirm = window.confirm(
        'This is your final warning. Deleting this group will remove ALL data associated with it. Type the group name to confirm.'
      );

      if (doubleConfirm) {
        try {
          await deleteGroup(group.id);
          onSuccess?.();
        } catch (error) {
          console.error('Failed to delete group:', error);
        }
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ] as const;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Group Settings</CardTitle>
        <CardDescription>
          Manage your group settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Settings</h3>
            <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter group name"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Enter group description (optional)"
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? 'Updating...' : 'Update Group'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Member Management</h3>
            <div className="text-sm text-gray-600">
              <p>Member count: {group.members?.length || 0}</p>
              <p className="mt-2">
                You can add new members using the "Manage Members" button on the main group page.
                Members can be removed by clicking the remove icon next to their name.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900">Member Roles</h4>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• <strong>Admin:</strong> Can manage group settings, add/remove members, and delete the group</li>
                <li>• <strong>Member:</strong> Can add expenses and view group information</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-medium text-red-900 mb-2">Delete Group</h4>
              <p className="text-sm text-red-800 mb-4">
                Permanently delete this group and all associated data. This action cannot be undone.
                All expenses, balances, and member data will be lost.
              </p>
              <Button
                variant="outline"
                onClick={handleDeleteGroup}
                disabled={isDeleting}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isDeleting ? 'Deleting...' : 'Delete Group'}
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
