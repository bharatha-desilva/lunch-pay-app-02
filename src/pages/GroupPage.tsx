
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
import { BalanceList } from '../components/balances/BalanceList';
import { useExpenses } from '../hooks/useExpenses';
import { calculateBalances, getUserBalance, calculateBalanceSummary } from '../utils/balanceCalculations';

import { MemberList } from '../components/groups/MemberList';
import { AddMemberForm } from '../components/groups/AddMemberForm';
import { GroupSettings } from '../components/groups/GroupSettings';
import { SettlementForm } from '../components/settlements/SettlementForm';
import { SettlementHistory } from '../components/settlements/SettlementHistory';
import { SettlementSuggestions } from '../components/settlements/SettlementSuggestions';
import { DEFAULT_CATEGORIES } from '../components/categories/CategoryManager';


export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  
  // Call all hooks first (before any conditional returns)
  const { group, members, isLoading, error } = useGroup(groupId || '');
  const { removeMember } = useGroups();
  const { user } = useAuth();
  const { expenses, isLoading: expensesLoading } = useExpenses(groupId);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  
  // Early return if no groupId (after all hooks are called)
  if (!groupId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h1>
          <p className="text-gray-600">Invalid group ID</p>
        </div>
      </div>
    );
  }

  // Calculate balances from expenses (client-side calculation)
  const balances = calculateBalances(expenses || []);
  const userBalance = getUserBalance(balances, user?.id || '');
  const { totalBalance, totalOwed, totalOwing } = calculateBalanceSummary(userBalance);
  
  // Create enhanced balances with user information for components that need it
  const balancesWithUsers = balances
    .filter(balance => balance.userId && balance.userId !== user?.id) // Exclude current user and invalid IDs
    .map(balance => {
      const member = members.find(m => m.id === balance.userId);
      if (!member) return null; // Skip if member not found
      
      return {
        ...balance,
        user: member
      };
    })
    .filter((balance): balance is NonNullable<typeof balance> => balance !== null) // Remove null entries with type guard
    .filter((balance, index, array) => 
      // Remove duplicates based on userId
      array.findIndex(b => b.userId === balance.userId) === index
    );
  
  // Mock settlements data - will be replaced with real settlements in later iteration
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
        isLoading={expensesLoading}
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
            balances={balances}
            groupMembers={members}
            onRecordSettlement={handleRecordSettlement}
          />
          
          {balancesWithUsers.length > 0 && (
            <BalanceList
              balances={balancesWithUsers}
              currentUserId={user?.id || ''}
              onSettle={(userId, amount) => console.log('Settle:', userId, amount)}
              isLoading={expensesLoading}
            />
          )}
        </div>

        {/* Middle Column - Recent Expenses */}
        <div className="space-y-4">
          <ExpenseList 
            expenses={(expenses || []).filter(expense => 
              expense && 
              expense.id && 
              typeof expense.id === 'string' &&
              expense.description &&
              typeof expense.amount === 'number'
            )}
            groupMembers={members}
            isLoading={expensesLoading}
          />
        </div>

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
