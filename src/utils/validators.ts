import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Group validation schemas
export const createGroupSchema = z.object({
  name: z.string()
    .min(1, 'Group name is required')
    .max(50, 'Group name must be less than 50 characters'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

export const addMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Expense validation schemas
export const createExpenseSchema = z.object({
  amount: z.number()
    .positive('Amount must be greater than 0')
    .max(1000000, 'Amount is too large'),
  description: z.string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  paidBy: z.string().min(1, 'Payer is required'),
  participants: z.array(z.string()).min(1, 'At least one participant is required'),
  splitType: z.enum(['equal', 'unequal']),
  customSplits: z.array(z.object({
    userId: z.string(),
    amount: z.number().positive(),
  })).optional(),
});

// Settlement validation schemas
export const createSettlementSchema = z.object({
  fromUserId: z.string().min(1, 'Payer is required'),
  toUserId: z.string().min(1, 'Recipient is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(30, 'Category name must be less than 30 characters'),
  color: z.string().optional(),
});

// Utility validation functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAmount(amount: number | string): {
  isValid: boolean;
  value: number;
  error?: string;
} {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return {
      isValid: false,
      value: 0,
      error: 'Please enter a valid number',
    };
  }
  
  if (numericAmount <= 0) {
    return {
      isValid: false,
      value: numericAmount,
      error: 'Amount must be greater than 0',
    };
  }
  
  if (numericAmount > 1000000) {
    return {
      isValid: false,
      value: numericAmount,
      error: 'Amount is too large',
    };
  }
  
  return {
    isValid: true,
    value: Math.round(numericAmount * 100) / 100, // Round to 2 decimal places
  };
}

export function validateSplits(
  totalAmount: number,
  splits: { userId: string; amount: number }[]
): {
  isValid: boolean;
  error?: string;
} {
  if (splits.length === 0) {
    return {
      isValid: false,
      error: 'At least one participant is required',
    };
  }
  
  const splitTotal = splits.reduce((sum, split) => sum + split.amount, 0);
  const difference = Math.abs(splitTotal - totalAmount);
  
  if (difference > 0.01) { // Allow for minor rounding differences
    return {
      isValid: false,
      error: `Split amounts (${splitTotal.toFixed(2)}) must equal the total expense amount (${totalAmount.toFixed(2)})`,
    };
  }
  
  return { isValid: true };
}
