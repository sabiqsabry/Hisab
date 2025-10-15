// Sample data and utility functions for the Hisaab app

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  defaultCurrency: string;
}

export interface Group {
  id: string;
  name: string;
  type: 'Trip' | 'Home' | 'Couple' | 'Other';
  baseCurrency: string;
  members: string[];
  createdBy: string;
  createdAt: string;
}

export interface ExpensePayer {
  userId: string;
  amount: number;
}

export interface ExpenseParticipant {
  userId: string;
  share: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  note?: string;
  payers: ExpensePayer[];
  participants: ExpenseParticipant[];
  groupId?: string;
  createdBy: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  date: string;
  note?: string;
  groupId?: string;
}

export interface Balance {
  owes: { [userId: string]: number };
  owedBy: { [userId: string]: number };
}

// Get user's default currency from localStorage or fallback to USD
export const getUserCurrency = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hisaab-user-currency') || 'USD';
  }
  return 'USD';
};

// Get user's name from localStorage or fallback
export const getUserName = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hisaab-user-name') || 'John Doe';
  }
  return 'John Doe';
};

// Static current user to avoid render issues
export const currentUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'test@hisaab.com',
  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  defaultCurrency: 'USD'
};

// Function to get current user with dynamic data (use sparingly)
export const getCurrentUser = (): User => ({
  id: 'user1',
  name: getUserName(),
  email: 'test@hisaab.com',
  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  defaultCurrency: getUserCurrency()
});

// Sample users
export const sampleUsers: User[] = [
  currentUser,
  {
    id: 'user2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    defaultCurrency: 'EUR'
  },
  {
    id: 'user3',
    name: 'Bob Smith',
    email: 'bob@example.com',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    defaultCurrency: 'GBP'
  },
  {
    id: 'user4',
    name: 'Carol Davis',
    email: 'carol@example.com',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    defaultCurrency: 'INR'
  }
];

// Sample groups
export const sampleGroups: Group[] = [
  {
    id: 'group1',
    name: 'Bali Trip 2024',
    type: 'Trip',
    baseCurrency: 'USD',
    members: ['user1', 'user2', 'user3'],
    createdBy: 'user1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'group2',
    name: 'Apartment 4B',
    type: 'Home',
    baseCurrency: 'USD',
    members: ['user1', 'user4'],
    createdBy: 'user1',
    createdAt: '2024-02-01T09:00:00Z'
  }
];

// Sample expenses
export const sampleExpenses: Expense[] = [
  {
    id: 'exp1',
    title: 'Dinner at Italian Restaurant',
    amount: 120.50,
    currency: 'USD',
    date: '2024-10-01',
    note: 'Food and dining',
    payers: [{ userId: 'user1', amount: 120.50 }],
    participants: [
      { userId: 'user1', share: 40.17 },
      { userId: 'user2', share: 40.17 },
      { userId: 'user3', share: 40.16 }
    ],
    groupId: 'group1',
    createdBy: 'user1',
    createdAt: '2024-10-01T19:30:00Z'
  },
  {
    id: 'exp2',
    title: 'Grocery Shopping',
    amount: 85.25,
    currency: 'USD',
    date: '2024-09-30',
    note: 'Food and groceries',
    payers: [{ userId: 'user4', amount: 85.25 }],
    participants: [
      { userId: 'user1', share: 42.63 },
      { userId: 'user4', share: 42.62 }
    ],
    groupId: 'group2',
    createdBy: 'user4',
    createdAt: '2024-09-30T16:45:00Z'
  },
  {
    id: 'exp3',
    title: 'Taxi to Airport',
    amount: 45.00,
    currency: 'USD',
    date: '2024-09-28',
    note: 'Transportation',
    payers: [{ userId: 'user2', amount: 45.00 }],
    participants: [
      { userId: 'user1', share: 15.00 },
      { userId: 'user2', share: 15.00 },
      { userId: 'user3', share: 15.00 }
    ],
    groupId: 'group1',
    createdBy: 'user2',
    createdAt: '2024-09-28T14:20:00Z'
  }
];

// Sample settlements
export const sampleSettlements: Settlement[] = [
  {
    id: 'settlement1',
    fromUserId: 'user2',
    toUserId: 'user1',
    amount: 25.00,
    currency: 'USD',
    date: '2024-10-02',
    note: 'Settlement for dinner',
    groupId: 'group1'
  },
  {
    id: 'settlement2',
    fromUserId: 'user1',
    toUserId: 'user4',
    amount: 42.63,
    currency: 'USD',
    date: '2024-10-01',
    note: 'Grocery payment',
    groupId: 'group2'
  }
];

// Currency data
export const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' }
];

// Utility functions
export const getUserById = (id: string): User | undefined => {
  return sampleUsers.find(user => user.id === id);
};

export const getGroupById = (id: string): Group | undefined => {
  return sampleGroups.find(group => group.id === id);
};

export const getUserGroups = (userId: string): Group[] => {
  return sampleGroups.filter(group => group.members.includes(userId));
};

export const getGroupExpenses = (groupId: string): Expense[] => {
  return sampleExpenses.filter(expense => expense.groupId === groupId);
};

export const getRecentExpenses = (limit: number = 10): Expense[] => {
  return sampleExpenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const calculateBalances = (userId: string): Balance => {
  const balance: Balance = { owes: {}, owedBy: {} };
  
  sampleExpenses.forEach(expense => {
    const userParticipant = expense.participants.find(p => p.userId === userId);
    if (!userParticipant) return;
    
    const userShare = userParticipant.share;
    const userPaid = expense.payers.find(p => p.userId === userId)?.amount || 0;
    const netAmount = userPaid - userShare;
    
    if (netAmount > 0) {
      // User paid more than their share, others owe them
      expense.participants.forEach(participant => {
        if (participant.userId !== userId) {
          const otherUserPaid = expense.payers.find(p => p.userId === participant.userId)?.amount || 0;
          const otherUserShare = participant.share;
          const otherNetAmount = otherUserPaid - otherUserShare;
          
          if (otherNetAmount < 0) {
            // Other user owes money
            const amountOwed = Math.min(Math.abs(otherNetAmount), netAmount * (participant.share / (expense.amount - userShare)));
            balance.owedBy[participant.userId] = (balance.owedBy[participant.userId] || 0) + amountOwed;
          }
        }
      });
    } else if (netAmount < 0) {
      // User owes money
      expense.payers.forEach(payer => {
        if (payer.userId !== userId) {
          const payerShare = expense.participants.find(p => p.userId === payer.userId)?.share || 0;
          const payerNetAmount = payer.amount - payerShare;
          
          if (payerNetAmount > 0) {
            // Payer is owed money
            const amountOwed = Math.min(Math.abs(netAmount), payerNetAmount * (userShare / (expense.amount - payerShare)));
            balance.owes[payer.userId] = (balance.owes[payer.userId] || 0) + amountOwed;
          }
        }
      });
    }
  });
  
  return balance;
};

export const getCategoryTotals = (userId: string): { [category: string]: number } => {
  const categoryTotals: { [category: string]: number } = {};
  
  sampleExpenses.forEach(expense => {
    const userParticipant = expense.participants.find(p => p.userId === userId);
    if (!userParticipant) return;
    
    // Extract category from note or use 'Other'
    const category = expense.note?.split(' ')[0] || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + userParticipant.share;
  });
  
  return categoryTotals;
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || '$';
  return `${symbol}${amount.toFixed(2)}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
};