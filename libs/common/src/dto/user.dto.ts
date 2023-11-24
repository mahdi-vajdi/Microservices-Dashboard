export type UserDto = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  refreshToken: string | null;
};
