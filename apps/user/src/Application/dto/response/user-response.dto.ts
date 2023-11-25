export class UserResponseDto {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly password: string;
  readonly refreshToken: string | null;
}
