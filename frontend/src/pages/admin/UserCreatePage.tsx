import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '@/components/admin/UserForm';
import usersService from '@/services/users.service';
import type { CreateUserRequest } from '@/services/users.service';

export default function UserCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateUserRequest) => {
    setIsLoading(true);
    try {
      await usersService.create(data);
      navigate('/dashboard/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="mb-6 text-xl font-bold text-foreground">Create New User</h1>
        <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
