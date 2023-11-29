export class UpdateRefreshTokenCommand {
  constructor(
    public readonly agentId: string,
    public readonly refreshToken: string | null,
  ) {}
}
