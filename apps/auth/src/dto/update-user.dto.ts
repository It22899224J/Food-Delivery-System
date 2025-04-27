import { USER_ROLE } from '@prisma/client';

export class UpdateUserDto {
  name?: string;
  password?: string;
  email?: string;
  address?: string;
  contact?: string;
  role?: USER_ROLE;
  location?: Record<string, any>;
  isAvailable?: boolean;
}
