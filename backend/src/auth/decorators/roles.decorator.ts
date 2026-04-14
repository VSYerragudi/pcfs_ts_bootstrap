import { SetMetadata } from '@nestjs/common';
import { Role } from '@pcfs-demo/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
