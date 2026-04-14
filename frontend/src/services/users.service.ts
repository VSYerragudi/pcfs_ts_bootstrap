import apiClient from '@/lib/api';
import type {
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
} from '@pcfs-demo/shared';

// Re-export for convenience
export type { UserDto, CreateUserRequest, UpdateUserRequest };

// Alias for backward compatibility
export type User = UserDto;

export const usersService = {
  async getAll(): Promise<UserDto[]> {
    return apiClient.get<UserDto[]>('/admin/users');
  },

  async getById(id: string): Promise<UserDto> {
    return apiClient.get<UserDto>(`/admin/users/${id}`);
  },

  async create(data: CreateUserRequest): Promise<UserDto> {
    return apiClient.post<UserDto>('/admin/users', data);
  },

  async update(id: string, data: UpdateUserRequest): Promise<UserDto> {
    return apiClient.put<UserDto>(`/admin/users/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async activate(id: string): Promise<UserDto> {
    return apiClient.post<UserDto>(`/admin/users/${id}/activate`);
  },

  async deactivate(id: string): Promise<UserDto> {
    return apiClient.post<UserDto>(`/admin/users/${id}/deactivate`);
  },

  async updateRoles(id: string, roles: string[]): Promise<UserDto> {
    return apiClient.put<UserDto>(`/admin/users/${id}/roles`, { roles });
  },
};

export default usersService;
