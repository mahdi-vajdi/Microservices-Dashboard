import { UserRoles } from './user-roles.enum';

export type UserDto = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRoles;
  password: string;
};
