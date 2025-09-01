import { format } from 'date-fns';

/**
 * Format currency amounts
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency without symbol
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format dates
 */
export function formatDate(date: string | Date): string {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    return format(parsedDate, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    return format(parsedDate, 'MMM dd, yyyy \'at\' h:mm a');
  } catch {
    return 'Invalid date';
  }
}

export function formatDateShort(date: string | Date): string {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    return format(parsedDate, 'MM/dd/yyyy');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format user names
 */
export function formatUserName(user: { name?: string; email: string }): string {
  if (!user || typeof user !== 'object') {
    return 'Unknown User';
  }
  
  if (user.name && typeof user.name === 'string') {
    return user.name;
  }
  
  if (user.email && typeof user.email === 'string') {
    return user.email.split('@')[0];
  }
  
  return 'Unknown User';
}

/**
 * Format initials for avatars
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'U';
  }
  
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || 'U';
}

/**
 * Format balance display
 */
export function formatBalance(amount: number): {
  text: string;
  type: 'positive' | 'negative' | 'zero';
  color: string;
} {
  if (amount === 0) {
    return {
      text: 'Settled up',
      type: 'zero',
      color: 'text-green-600',
    };
  }

  if (amount > 0) {
    return {
      text: `You are owed ${formatCurrency(amount)}`,
      type: 'positive',
      color: 'text-green-600',
    };
  }

  return {
    text: `You owe ${formatCurrency(Math.abs(amount))}`,
    type: 'negative',
    color: 'text-red-600',
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format file sizes
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
