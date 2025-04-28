import { USER_ROLE } from '@prisma/client';

export class UpdateUserDto {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
  role?: USER_ROLE;
}