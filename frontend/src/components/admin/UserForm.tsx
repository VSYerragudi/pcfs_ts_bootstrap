import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/services/auth.service';
import type { CreateUserRequest, UpdateUserRequest } from '@/services/users.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

const AVAILABLE_ROLES = ['user', 'admin'];

export function UserForm({ user, onSubmit, isLoading }: UserFormProps) {
  const navigate = useNavigate();
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: ['user'] as string[],
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        roles: user.roles,
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          roles: formData.roles,
          isActive: formData.isActive,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await onSubmit(updateData);
      } else {
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }
        await onSubmit(formData as CreateUserRequest);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          required
          minLength={2}
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password {isEditing && '(leave blank to keep current)'}
        </Label>
        <Input
          id="password"
          type="password"
          required={!isEditing}
          minLength={8}
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder={isEditing ? '••••••••' : 'Minimum 8 characters'}
        />
      </div>

      <div className="space-y-2">
        <Label>Roles</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_ROLES.map((role) => (
            <Badge
              key={role}
              variant={formData.roles.includes(role) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleRoleToggle(role)}
            >
              {role}
            </Badge>
          ))}
        </div>
        {formData.roles.length === 0 && (
          <p className="text-xs text-destructive">At least one role is required</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isActive: checked === true }))
          }
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Account is active
        </Label>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard/admin/users')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || formData.roles.length === 0}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
