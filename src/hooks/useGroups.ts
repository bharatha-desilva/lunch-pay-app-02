import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import groupsService from '../services/groups.service';
import { Group, CreateGroupData, AddMemberData } from '../types/group.types';

export function useGroups() {
  const queryClient = useQueryClient();

  // Fetch all groups
  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupsService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (data: CreateGroupData) => groupsService.create(data),
    onSuccess: (newGroup) => {
      // Just invalidate to refetch fresh data from server
      // This prevents cache inconsistencies and duplicates
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: (data: Partial<Group> & { id: string }) => 
      groupsService.update(data),
    onSuccess: (updatedGroup) => {
      // Update the specific group in the list
      queryClient.setQueryData<Group[]>(['groups'], (old) =>
        old ? old.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        ) : [updatedGroup]
      );
      // Update single group query if it exists
      queryClient.setQueryData(['groups', updatedGroup.id], updatedGroup);
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => groupsService.delete(groupId),
    onSuccess: (_, groupId) => {
      // Remove the group from the list
      queryClient.setQueryData<Group[]>(['groups'], (old) =>
        old ? old.filter(group => group.id !== groupId) : []
      );
      // Remove single group query
      queryClient.removeQueries({ queryKey: ['groups', groupId] });
      // Invalidate related data
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (data: AddMemberData) => groupsService.addMember(data),
    onSuccess: (updatedGroup) => {
      // Update the group with new member
      queryClient.setQueryData<Group[]>(['groups'], (old) =>
        old ? old.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        ) : [updatedGroup]
      );
      queryClient.setQueryData(['groups', updatedGroup.id], updatedGroup);
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => 
      groupsService.removeMember(groupId, userId),
    onSuccess: (updatedGroup) => {
      // Update the group without the removed member
      queryClient.setQueryData<Group[]>(['groups'], (old) =>
        old ? old.map(group => 
          group.id === updatedGroup.id ? updatedGroup : group
        ) : [updatedGroup]
      );
      queryClient.setQueryData(['groups', updatedGroup.id], updatedGroup);
    },
  });

  return {
    // Query data
    groups: groupsQuery.data || [],
    isLoading: groupsQuery.isLoading,
    error: groupsQuery.error,
    
    // Mutations
    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    addMember: addMemberMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    
    // Mutation states
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    
    // Error states
    createError: createGroupMutation.error,
    updateError: updateGroupMutation.error,
    deleteError: deleteGroupMutation.error,
    addMemberError: addMemberMutation.error,
    removeMemberError: removeMemberMutation.error,
    
    // Utility functions
    refetch: groupsQuery.refetch,
    clearCache: () => queryClient.removeQueries({ queryKey: ['groups'] }),
  };
}

export function useGroup(groupId: string) {
  const queryClient = useQueryClient();

  // Fetch single group
  const groupQuery = useQuery({
    queryKey: ['groups', groupId],
    queryFn: async () => {
      // First try to find the group in the cached groups list
      const cachedGroups = queryClient.getQueryData<Group[]>(['groups']);
      const cachedGroup = cachedGroups?.find(g => g.id === groupId);
      
      if (cachedGroup) {
        return cachedGroup;
      }
      
      // If not found in cache and it's not a temporary ID, try API
      if (!groupId.startsWith('temp-')) {
        return groupsService.getById(groupId);
      }
      
      // If it's a temporary ID, return null (group not found)
      throw new Error('Group not found');
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch group members
  const membersQuery = useQuery({
    queryKey: ['groups', groupId, 'members'],
    queryFn: async () => {
      // For temporary IDs, try to get members from cached group data
      if (groupId.startsWith('temp-')) {
        const cachedGroups = queryClient.getQueryData<Group[]>(['groups']);
        const cachedGroup = cachedGroups?.find(g => g.id === groupId);
        return cachedGroup?.members || [];
      }
      
      // For real IDs, call the API
      return groupsService.getMembers(groupId);
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    group: groupQuery.data,
    members: membersQuery.data || [],
    isLoading: groupQuery.isLoading || membersQuery.isLoading,
    error: groupQuery.error || membersQuery.error,
    refetch: () => {
      groupQuery.refetch();
      membersQuery.refetch();
    },
  };
}

export function useUserSearch() {
  const searchUsersMutation = useMutation({
    mutationFn: (query: string) => groupsService.searchUsers(query),
  });

  return {
    searchUsers: searchUsersMutation.mutateAsync,
    isSearching: searchUsersMutation.isPending,
    searchError: searchUsersMutation.error,
    searchResults: searchUsersMutation.data || [],
  };
}
