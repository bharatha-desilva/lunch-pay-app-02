
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CreateGroupForm } from '../components/groups/CreateGroupForm';
import { RefreshPrompt } from '../components/ui/RefreshPrompt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency, formatUserName } from '../utils/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const { groups, isLoading, refetch } = useGroups();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter out groups without valid IDs
  const validGroups = groups.filter(group => group.id && group.id !== 'undefined' && group.id !== 'null');
  const hasTemporaryGroups = groups.some(group => group.id && group.id.startsWith('temp-'));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user ? formatUserName(user) : 'User'}!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalGroups = validGroups.length;
  const totalMembers = validGroups.reduce((sum, group) => sum + (group.members?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Refresh prompt for temporary groups */}
      {hasTemporaryGroups && (
        <RefreshPrompt 
          message="Some groups are still being synchronized. Please refresh to see the latest data."
          onRefresh={refetch}
        />
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user ? formatUserName(user) : 'User'}!</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              {totalGroups === 1 ? 'group' : 'groups'} you're part of
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              across all your groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">
              you're all settled up!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
          {groups.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Group
            </Button>
          )}
        </div>

        {validGroups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Create your first group to start splitting expenses with friends, family, or colleagues.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validGroups.map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription>
                      {group.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members?.length || 0} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>$0.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600 text-center">
              Start adding expenses to see your activity here.
            </p>
          </CardContent>
        </Card>
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
    </div>
  );
}
