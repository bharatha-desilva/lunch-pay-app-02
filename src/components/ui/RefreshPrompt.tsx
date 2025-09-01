import { RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface RefreshPromptProps {
  message?: string;
  onRefresh?: () => void;
}

export function RefreshPrompt({ 
  message = "Some data may be outdated. Please refresh to see the latest information.",
  onRefresh
}: RefreshPromptProps) {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <RefreshCw className="w-5 h-5 text-blue-600" />
        <p className="text-sm text-blue-800">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        className="border-blue-300 text-blue-700 hover:bg-blue-100"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}
