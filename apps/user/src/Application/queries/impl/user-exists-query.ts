export class UserExistsQuery {
  constructor(
    public readonly email: string,
    public readonly phone: string,
  ) {}
}
