
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Users, Settings, CreditCard } from 'lucide-react';
import { useGroup, useGroups } from '../hooks/useGroups';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { BalanceSummary } from '../components/balances/BalanceSummary';

import { MemberList } from '../components/groups/MemberList';
import { AddMemberForm } from '../components/groups/AddMemberForm';
import { GroupSettings } from '../components/groups/GroupSettings';
import { SettlementForm } from '../components/settlements/SettlementForm';
import { SettlementHistory } from '../components/settlements/SettlementHistory';
import { SettlementSuggestions } from '../components/settlements/SettlementSuggestions';
import { DEFAULT_CATEGORIES } from '../components/categories/CategoryManager';


export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { group, members, isLoading, error } = useGroup(groupId!);
  const { removeMember } = useGroups();
  const { user } = useAuth();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);

  // Mock data for demonstration - will be replaced with real data in Iteration 2
  const mockExpenses: never[] = [];
  const mockBalances = [
    { userId: '1', amount: 25.50 },
    { userId: '2', amount: -15.25 },
    { userId: '3', amount: -10.25 },
  ];
  const mockSettlements: Array<{
    id: string;
    groupId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    description: string;
    createdAt: string;
  }> = [
    {
      id: '1',
      groupId: groupId || '',
      fromUserId: '2',
      toUserId: '1',
      amount: 20.00,
      description: 'Paid back for lunch',
      createdAt: new Date().toISOString(),
    }
  ];
  const totalBalance = 0;
  const totalOwed = 0;
  const totalOwing = 0;

  // Handle member removal
  const handleRemoveMember = async (userId: string) => {
    if (!groupId) return;
    
    const confirmRemoval = window.confirm(
      'Are you sure you want to remove this member from the group? This action cannot be undone.'
    );
    
    if (confirmRemoval) {
      try {
        await removeMember({ groupId, userId });
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  // Handle settlement recording
  const handleRecordSettlement = () => {
    setIsSettlementModalOpen(true);
    // Could pre-populate the form with settlement data here
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Group not found</h2>
        <p className="text-gray-600 mb-4">The group you're looking for doesn't exist or you don't have access to it.</p>
        <div className="text-sm text-gray-500 bg-gray-100 p-4 rounded">
          <p><strong>Group ID:</strong> {groupId}</p>
          <p><strong>Error:</strong> {error?.message || 'No group data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
          {group.description && (
            <p className="text-gray-600 mt-1">{group.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {group?.adminId === user?.id && (
            <Button 
              variant="outline"
              onClick={() => setIsGroupSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Members
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsSettlementModalOpen(true)}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
          <Button onClick={() => setIsExpenseModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Balance Summary */}
      <BalanceSummary
        totalBalance={totalBalance}
        totalOwed={totalOwed}
        totalOwing={totalOwing}
        isLoading={false}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Members & Settlement Suggestions */}
        <div className="space-y-6">
          <MemberList
            members={members}
            currentUserId={user?.id || ''}
            isAdmin={group?.adminId === user?.id}
            onAddMember={() => setIsAddMemberModalOpen(true)}
            onRemoveMember={handleRemoveMember}
            isLoading={isLoading}
          />
          
          <SettlementSuggestions
            balances={mockBalances}
            groupMembers={members}
            onRecordSettlement={handleRecordSettlement}
          />
        </div>

        {/* Middle Column - Recent Expenses */}
        <ExpenseList 
          expenses={mockExpenses}
          isLoading={false}
        />

        {/* Right Column - Settlement History */}
        <SettlementHistory
          settlements={mockSettlements}
          groupMembers={members}
          isLoading={false}
        />
      </div>

      {/* Add Expense Modal */}
      <Modal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)}
      >
        <ExpenseForm 
          groupId={groupId!}
          groupMembers={(members || []).map(member => ({
            id: member.id,
            name: member.name || '',
            email: member.email,
          }))}
          categories={DEFAULT_CATEGORIES.map((cat, index) => ({
            ...cat,
            id: `default-${index}`,
            createdAt: new Date().toISOString(),
          }))}
          onSuccess={() => setIsExpenseModalOpen(false)}
          onCancel={() => setIsExpenseModalOpen(false)}
        />
      </Modal>

      {/* Add Member Modal */}
      <Modal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)}
      >
        <AddMemberForm 
          groupId={groupId!}
          onSuccess={() => setIsAddMemberModalOpen(false)}
          onCancel={() => setIsAddMemberModalOpen(false)}
        />
      </Modal>

      {/* Group Settings Modal */}
      <Modal 
        isOpen={isGroupSettingsOpen} 
        onClose={() => setIsGroupSettingsOpen(false)}
      >
        <GroupSettings 
          group={group!}
          onSuccess={() => setIsGroupSettingsOpen(false)}
          onCancel={() => setIsGroupSettingsOpen(false)}
        />
      </Modal>

      {/* Settlement Form Modal */}
      <Modal 
        isOpen={isSettlementModalOpen} 
        onClose={() => setIsSettlementModalOpen(false)}
      >
        <SettlementForm 
          groupId={groupId!}
          groupMembers={members}
          onSuccess={() => setIsSettlementModalOpen(false)}
          onCancel={() => setIsSettlementModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
