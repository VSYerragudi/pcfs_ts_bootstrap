export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  roles?: Role[];
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
  roles?: Role[];
  isActive?: boolean;
}
