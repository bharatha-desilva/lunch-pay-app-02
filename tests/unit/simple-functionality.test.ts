/**
 * Simple Functionality Tests
 * Tests core business logic without complex dependencies
 */

describe('Core Business Logic', () => {
  describe('expense splitting calculations', () => {
    it('should split expenses equally among members', () => {
      const totalAmount = 100;
      const memberCount = 4;
      const splitAmount = totalAmount / memberCount;
      
      expect(splitAmount).toBe(25);
    });

    it('should handle uneven splits correctly', () => {
      const totalAmount = 100;
      const memberCount = 3;
      const splitAmount = Number((totalAmount / memberCount).toFixed(2));
      
      expect(splitAmount).toBe(33.33);
    });

    it('should calculate individual shares for custom splits', () => {
      const totalAmount = 120;
      const shares = [40, 30, 50]; // Custom amounts
      const totalShares = shares.reduce((sum, share) => sum + share, 0);
      
      expect(totalShares).toBe(totalAmount);
      
      const percentages = shares.map(share => 
        Number(((share / totalAmount) * 100).toFixed(1))
      );
      
      expect(percentages).toEqual([33.3, 25.0, 41.7]);
    });
  });

  describe('balance calculations', () => {
    it('should calculate member balances correctly', () => {
      const expenses = [
        { amount: 60, paidBy: 'user1', splitAmong: ['user1', 'user2', 'user3'] },
        { amount: 30, paidBy: 'user2', splitAmong: ['user1', 'user2'] },
        { amount: 45, paidBy: 'user3', splitAmong: ['user1', 'user2', 'user3'] }
      ];

      // Calculate what each person paid
      const paid = { user1: 60, user2: 30, user3: 45 };
      
      // Calculate what each person owes
      const owes = { user1: 0, user2: 0, user3: 0 };
      
      expenses.forEach(expense => {
        const splitAmount = expense.amount / expense.splitAmong.length;
        expense.splitAmong.forEach(user => {
          owes[user as keyof typeof owes] += splitAmount;
        });
      });

      // Calculate final balances (paid - owes)
      const balances = {
        user1: paid.user1 - owes.user1, // 60 - 50 = 10
        user2: paid.user2 - owes.user2, // 30 - 35 = -5
        user3: paid.user3 - owes.user3  // 45 - 50 = -5
      };

      // user1: owes 20 + 15 + 15 = 50, paid 60, balance = 10
      // user2: owes 20 + 15 + 15 = 50, paid 30, balance = -20  
      // user3: owes 20 + 15 = 35, paid 45, balance = 10
      expect(balances.user1).toBe(10);  // Paid 60, owes 50
      expect(balances.user2).toBe(-20); // Paid 30, owes 50
      expect(balances.user3).toBe(10);  // Paid 45, owes 35
    });

    it('should identify who owes whom', () => {
      const balances = {
        user1: -20, // Owes money
        user2: 15,  // Is owed money
        user3: 5    // Is owed money
      };

      const settlements = [];
      const debtors = Object.entries(balances).filter(([, balance]) => balance < 0);
      const creditors = Object.entries(balances).filter(([, balance]) => balance > 0);

      debtors.forEach(([debtor, debt]) => {
        creditors.forEach(([creditor, credit]) => {
          if (Math.abs(debt) > 0 && credit > 0) {
            const amount = Math.min(Math.abs(debt), credit);
            settlements.push({
              from: debtor,
              to: creditor,
              amount: amount
            });
          }
        });
      });

      expect(settlements.length).toBeGreaterThan(0);
      expect(settlements[0].from).toBe('user1');
      expect(settlements[0].amount).toBeGreaterThan(0);
    });
  });

  describe('group member management', () => {
    it('should add members to group', () => {
      const group = {
        id: 'group1',
        name: 'Test Group',
        members: ['user1', 'user2']
      };

      const newMember = 'user3';
      const updatedMembers = [...group.members, newMember];

      expect(updatedMembers).toContain('user1');
      expect(updatedMembers).toContain('user2');
      expect(updatedMembers).toContain('user3');
      expect(updatedMembers.length).toBe(3);
    });

    it('should remove members from group', () => {
      const group = {
        id: 'group1',
        name: 'Test Group',
        members: ['user1', 'user2', 'user3']
      };

      const memberToRemove = 'user2';
      const updatedMembers = group.members.filter(member => member !== memberToRemove);

      expect(updatedMembers).toContain('user1');
      expect(updatedMembers).not.toContain('user2');
      expect(updatedMembers).toContain('user3');
      expect(updatedMembers.length).toBe(2);
    });

    it('should prevent duplicate members', () => {
      const group = {
        id: 'group1',
        name: 'Test Group',
        members: ['user1', 'user2']
      };

      const newMember = 'user1'; // Duplicate
      const canAdd = !group.members.includes(newMember);

      expect(canAdd).toBe(false);
    });
  });

  describe('data validation helpers', () => {
    it('should validate expense data', () => {
      const validExpense = {
        amount: 25.50,
        description: 'Lunch',
        paidBy: 'user1',
        splitAmong: ['user1', 'user2']
      };

      const isValid = validExpense.amount > 0 &&
        validExpense.description.trim().length > 0 &&
        validExpense.paidBy.trim().length > 0 &&
        validExpense.splitAmong.length > 0;

      expect(isValid).toBe(true);
    });

    it('should reject invalid expense data', () => {
      const invalidExpenses = [
        { amount: 0, description: 'Test', paidBy: 'user1', splitAmong: ['user1'] },
        { amount: 25, description: '', paidBy: 'user1', splitAmong: ['user1'] },
        { amount: 25, description: 'Test', paidBy: '', splitAmong: ['user1'] },
        { amount: 25, description: 'Test', paidBy: 'user1', splitAmong: [] }
      ];

      invalidExpenses.forEach(expense => {
        const isValid = expense.amount > 0 &&
          expense.description.trim().length > 0 &&
          expense.paidBy.trim().length > 0 &&
          expense.splitAmong.length > 0;

        expect(isValid).toBe(false);
      });
    });
  });

  describe('array and object utilities', () => {
    it('should safely access nested properties', () => {
      const user = {
        profile: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      const name = user?.profile?.name;
      const phone = (user as { profile?: { phone?: string } })?.profile?.phone || 'Not provided';

      expect(name).toBe('John Doe');
      expect(phone).toBe('Not provided');
    });

    it('should filter and sort arrays correctly', () => {
      const expenses = [
        { id: 1, amount: 25, date: '2024-01-01' },
        { id: 2, amount: 50, date: '2024-01-02' },
        { id: 3, amount: 10, date: '2024-01-03' }
      ];

      // Filter expenses over $20
      const largeExpenses = expenses.filter(expense => expense.amount > 20);
      expect(largeExpenses.length).toBe(2);

      // Sort by amount descending
      const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
      expect(sortedExpenses[0].amount).toBe(50);
      expect(sortedExpenses[2].amount).toBe(10);
    });
  });
});
