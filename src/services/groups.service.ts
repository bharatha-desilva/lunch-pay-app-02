import { createEntityApi } from './api';
import apiService from './api';
import { Group, CreateGroupData, AddMemberData } from '../types/group.types';
import { User } from '../types/auth.types';

// Use the generic entity API for basic CRUD operations
const groupsApi = createEntityApi<Group>('groups');

class GroupsService {
  // Basic CRUD operations
  async getAll() {
    const groups = await groupsApi.getAll();
    
    // Ensure all groups have valid IDs and filter out invalid ones
    const processedGroups = groups
      .filter(group => group && typeof group === 'object')
      .map((group, index) => ({
        ...group,
        // Fallback ID generation if missing
        id: group.id || `temp-${Date.now()}-${index}`
      }))
      .filter(group => group.id && group.id !== 'undefined' && group.id !== 'null');
    
    // Advanced deduplication: prefer real IDs over temporary ones
    const uniqueGroups = new Map();
    
    processedGroups.forEach(group => {
      const key = group.id;
      const existing = uniqueGroups.get(key);
      
      if (!existing) {
        uniqueGroups.set(key, group);
      } else {
        // If we have a duplicate, prefer the one with more complete data
        const hasMoreData = (group.members?.length || 0) >= (existing.members?.length || 0);
        if (hasMoreData) {
          uniqueGroups.set(key, group);
        }
      }
    });
    
    // Also check for name-based duplicates (different IDs, same name)
    const nameMap = new Map<string, Group>();
    const finalGroups: Group[] = [];
    
    for (const group of uniqueGroups.values()) {
      const existingWithSameName = nameMap.get(group.name);
      
      if (!existingWithSameName) {
        nameMap.set(group.name, group);
        finalGroups.push(group);
      } else {
        // Prefer real IDs over temporary ones
        const isCurrentReal = !group.id.startsWith('temp-');
        const isExistingReal = !existingWithSameName.id.startsWith('temp-');
        
        if (isCurrentReal && !isExistingReal) {
          // Replace temporary with real
          nameMap.set(group.name, group);
          const index = finalGroups.findIndex(g => g.id === existingWithSameName.id);
          if (index >= 0) {
            finalGroups[index] = group;
          }
        } else if (!isCurrentReal && !isExistingReal) {
          // Both are temporary, keep the first one
          // Do nothing
        } else if (!isCurrentReal && isExistingReal) {
          // Keep the existing real ID
          // Do nothing
        } else {
          // Both are real IDs but same name - this suggests data issues
          // Keep both but log the issue
          console.warn('Duplicate group names with different IDs:', group.name, group.id, existingWithSameName.id);
          finalGroups.push(group);
        }
      }
    }
    
    return finalGroups;
  }

  async getById(id: string) {
    return groupsApi.getById(id);
  }

  async create(data: CreateGroupData) {
    return groupsApi.saveNew(data);
  }

  async update(data: Partial<Group> & { id: string }) {
    return groupsApi.update(data);
  }

  async delete(id: string) {
    return groupsApi.delete(id);
  }

  // Custom operations
  async addMember(data: AddMemberData): Promise<Group> {
    try {
      const response = await apiService.post<Group>(
        `/groups/${data.groupId}/members`,
        { email: data.email }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(groupId: string, userId: string): Promise<Group> {
    try {
      const response = await apiService.post<Group>(
        `/groups/${groupId}/members/${userId}/remove`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getMembers(groupId: string): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>(`/groups/${groupId}/members`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>('/users/search', { 
        q: query,
        limit: 10 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const groupsService = new GroupsService();
export default groupsService;
