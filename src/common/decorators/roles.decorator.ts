import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// key name for metadata
export const ROLES_KEY = 'roles';

// decorator
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
