
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus } from 'lucide-react';
import { useGroups } from '../../hooks/useGroups';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CreateGroupForm } from '../groups/CreateGroupForm';
import { cn } from '../../utils/cn';

export function Sidebar() {
  const location = useLocation();
  const { groups, isLoading } = useGroups();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter out groups without valid IDs and duplicates
  const validGroups = groups.filter(group => group.id && group.id !== 'undefined' && group.id !== 'null');
  const uniqueGroups = validGroups.filter((group, index, self) => 
    index === self.findIndex(g => g.id === group.id)
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isGroupActive = (groupId: string) => {
    return location.pathname === `/groups/${groupId}`;
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive('/dashboard') || isActive('/')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Groups Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Groups
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-6 w-6"
                title="Create new group"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : uniqueGroups.length > 0 ? (
              <div className="space-y-1">
                {uniqueGroups.map((group) => (
                  <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                      isGroupActive(group.id)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Users className="w-4 h-4" />
                    <span className="truncate">{group.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {group.members?.length || 0}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 px-3 py-2">
                No groups yet. Create your first group to get started!
              </p>
            )}
          </div>
        </nav>
      </div>

      {/* Create Group Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
      >
        <CreateGroupForm 
          onSuccess={() => setIsCreateModalOpen(false)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </aside>
  );
}
