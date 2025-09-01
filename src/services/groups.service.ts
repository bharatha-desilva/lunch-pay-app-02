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
    
    // API returns MongoDB-style _id fields, map them to id
    const processedGroups = groups
      .filter(group => group && typeof group === 'object')
      .map(group => ({
        ...group,
        id: group.id || group._id || `group-${Date.now()}-${Math.random()}`
      }))
      .filter(group => group.id && group.id !== 'undefined' && group.id !== 'null');
    
    // Simple deduplication by ID
    const uniqueGroups = new Map();
    
    processedGroups.forEach(group => {
      const key = group.id;
      const existing = uniqueGroups.get(key);
      
      if (!existing) {
        uniqueGroups.set(key, group);
      } else {
        // If we have a duplicate ID, prefer the one with more complete data
        const hasMoreData = (group.members?.length || 0) >= (existing.members?.length || 0);
        if (hasMoreData) {
          uniqueGroups.set(key, group);
        }
      }
    });
    
    return Array.from(uniqueGroups.values());
  }

  async getById(id: string) {
    const group = await groupsApi.getById(id);
    
    // Apply same ID mapping as in getAll
    if (group) {
      return {
        ...group,
        id: group.id || group._id || id
      };
    }
    
    return group;
  }

  async create(data: CreateGroupData) {
    // Ensure new groups have an empty members array
    const groupWithMembers = {
      ...data,
      members: [] // Initialize with empty members array
    };
    return groupsApi.saveNew(groupWithMembers);
  }

  async update(data: Partial<Group> & { id: string }) {
    return groupsApi.update(data);
  }

  async delete(id: string) {
    return groupsApi.delete(id);
  }

  // Custom operations - Client-side member management using single-level API
  async addMember(data: AddMemberData): Promise<Group> {
    // Check if this is a temporary group ID
    if (data.groupId.startsWith('temp-')) {
      throw new Error('Cannot add members to a group that hasn\'t been properly created yet. Please refresh the page and try again.');
    }
    
    try {
      // Step 1: Get the current group
      const currentGroup = await this.getById(data.groupId);
      
      // Step 2: Look up or create user by email
      let newMember;
      try {
        // Try to find existing user by email
        const existingUsers = await this.searchUsers(data.email);
        newMember = existingUsers.find(user => user.email === data.email);
      } catch (error) {
        // If user search fails, continue with mock user
      }
      
      // If no existing user found, create a mock member object
      if (!newMember) {
        newMember = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: data.email.split('@')[0], // Extract name from email
          email: data.email
        };
      }
      
      // Step 3: Check if member already exists in the group
      const existingMembers = currentGroup.members || [];
      const memberExists = existingMembers.some(member => 
        member.email === data.email || member.id === newMember.id
      );
      
      if (memberExists) {
        throw new Error('User is already a member of this group.');
      }
      
      // Step 4: Add member to the group's members array
      const updatedMembers = [...existingMembers, newMember];
      
      // Step 5: Update the group with the new members array
      const updatedGroup = {
        id: currentGroup.id,
        name: currentGroup.name,
        description: currentGroup.description,
        members: updatedMembers,
        adminId: currentGroup.adminId,
        createdAt: currentGroup.createdAt
      };
      
      // Step 6: Save the updated group back to the API
      const response = await this.update(updatedGroup);
      return response;
      
    } catch (error) {
      throw error;
    }
  }

  async removeMember(groupId: string, userId: string): Promise<Group> {
    // Check if this is a temporary group ID
    if (groupId.startsWith('temp-')) {
      throw new Error('Cannot remove members from a group that hasn\'t been properly created yet. Please refresh the page and try again.');
    }
    
    try {
      // Step 1: Get the current group
      const currentGroup = await this.getById(groupId);
      
      // Step 2: Remove the member from the members array
      const updatedMembers = (currentGroup.members || []).filter(member => member.id !== userId);
      
      // Step 3: Update the group with the filtered members array
      const updatedGroup = {
        id: currentGroup.id,
        name: currentGroup.name,
        description: currentGroup.description,
        members: updatedMembers,
        adminId: currentGroup.adminId,
        createdAt: currentGroup.createdAt
      };
      
      // Step 4: Save the updated group back to the API
      const response = await this.update(updatedGroup);
      return response;
      
    } catch (error) {
      throw error;
    }
  }

  // Note: Members are included in the group object, no separate endpoint needed

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
