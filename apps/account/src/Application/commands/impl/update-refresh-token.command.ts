export class UpdateRefreshTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly token: string | null,
  ) {}
}
