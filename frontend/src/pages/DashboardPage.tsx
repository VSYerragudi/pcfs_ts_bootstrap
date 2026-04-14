import { Link } from 'react-router-dom';
import { Users, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const { user, isAdmin } = useAuthStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.name ?? 'User'}!
          {isAdmin && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Shield className="h-3 w-3" />
              Administrator
            </span>
          )}
        </p>
      </div>

      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Admin Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/admin/users"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Projects
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">12</p>
          <p className="mt-1 text-xs text-muted-foreground">+2 from last month</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Tasks
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">24</p>
          <p className="mt-1 text-xs text-muted-foreground">8 due this week</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completed
          </h3>
          <p className="mt-2 text-3xl font-bold text-foreground">89%</p>
          <p className="mt-1 text-xs text-muted-foreground">+5% from last week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Recent Activity
        </h2>
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="divide-y divide-border">
            {[
              { action: 'Created new project', time: '2 hours ago' },
              { action: 'Completed task: Setup database', time: '4 hours ago' },
              { action: 'Updated project settings', time: 'Yesterday' },
              { action: 'Added team member', time: '2 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <span className="text-sm text-foreground">{item.action}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
