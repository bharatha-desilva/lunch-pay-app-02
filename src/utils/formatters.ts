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
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy \'at\' h:mm a');
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'MM/dd/yyyy');
}

/**
 * Format user names
 */
export function formatUserName(user: { name?: string; email: string }): string {
  return user.name || user.email.split('@')[0];
}

/**
 * Format initials for avatars
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
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
