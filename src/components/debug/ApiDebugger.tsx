import { useGroups } from '../../hooks/useGroups';

interface ApiDebuggerProps {
  enabled?: boolean;
}

export function ApiDebugger({ enabled = false }: ApiDebuggerProps) {
  const { groups } = useGroups();

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md max-h-64 overflow-auto text-xs z-50">
      <h3 className="font-bold mb-2">API Debug Info</h3>
      <div>
        <strong>Groups Count:</strong> {groups.length}
      </div>
      <div className="mt-2">
        <strong>Group IDs:</strong>
        <ul className="list-disc list-inside">
          {groups.map((group, index) => (
            <li key={index}>
              {group.id || 'NO ID'} - {group.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <strong>Raw Data:</strong>
        <pre className="mt-1 text-xs overflow-auto">
          {JSON.stringify(groups, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Usage: Add <ApiDebugger enabled={true} /> to any component temporarily
