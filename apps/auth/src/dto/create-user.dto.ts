import { USER_ROLE } from '@prisma/client';

export class CreateUserDto {
  name: string;
  password: string;
  email: string;
  address: string;
  role?: USER_ROLE = USER_ROLE.CUSTOMER;
  contact: string;
  updatedAt?: Date;
}
