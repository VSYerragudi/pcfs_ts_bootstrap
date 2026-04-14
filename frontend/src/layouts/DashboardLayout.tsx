import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Footer } from '@/components/Footer';
import { DashboardNav } from '@/components/DashboardNav';

export default function DashboardLayout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav user={user} isAdmin={isAdmin} onLogout={handleLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
