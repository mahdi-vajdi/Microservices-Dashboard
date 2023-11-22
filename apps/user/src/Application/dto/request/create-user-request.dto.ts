import { UserRoles } from 'apps/user/src/Domain/user-roles.enum';

export class CreateUserRequestDto {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  role: UserRoles;

  password: string;

  refreshToken: string;
}
