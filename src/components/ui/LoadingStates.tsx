import { Loader2 } from 'lucide-react';

// Basic Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Card Loading Skeleton
export function CardSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton({ 
  count = 3, 
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Form Field Skeleton
export function FormSkeleton({ 
  fields = 4, 
  className = '' 
}: { 
  fields?: number; 
  className?: string; 
}) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
        <div className="h-10 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

// Page Loading Overlay
export function PageLoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <LoadingSpinner size="lg" />
        <span className="text-lg font-medium text-gray-900">{message}</span>
      </div>
    </div>
  );
}

// Button Loading State
export function ButtonLoading({ 
  isLoading, 
  children, 
  loadingText, 
  disabled,
  ...props 
}: { 
  isLoading: boolean; 
  children: React.ReactNode; 
  loadingText?: string; 
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} disabled={isLoading || disabled}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>{loadingText || 'Loading...'}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Shimmer Effect for Images
export function ImageSkeleton({ 
  className = 'w-full h-48' 
}: { 
  className?: string; 
}) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`}>
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

// Progress Bar
export function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = false 
}: { 
  progress: number; 
  className?: string; 
  showPercentage?: boolean; 
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{clampedProgress.toFixed(0)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// Pulse Animation for Live Updates
export function PulseIndicator({ 
  color = 'green', 
  size = 'sm' 
}: { 
  color?: 'green' | 'blue' | 'red' | 'yellow'; 
  size?: 'sm' | 'md' | 'lg'; 
}) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex items-center space-x-1">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`} />
      <span className="text-xs text-gray-500">Live</span>
    </div>
  );
}
