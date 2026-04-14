import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '@/components/admin/UserForm';
import usersService from '@/services/users.service';
import type { User } from '@/services/auth.service';
import type { UpdateUserRequest } from '@/services/users.service';

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setIsFetching(true);
        const data = await usersService.getById(id);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (data: UpdateUserRequest) => {
    if (!id) return;

    setIsLoading(true);
    try {
      await usersService.update(id, data);
      navigate('/dashboard/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading user...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <button
          onClick={() => navigate('/dashboard/admin/users')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate('/dashboard/admin/users')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </button>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-foreground">Edit User</h1>
        <UserForm user={user} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
