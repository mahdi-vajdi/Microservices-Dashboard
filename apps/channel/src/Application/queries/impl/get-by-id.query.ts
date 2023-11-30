export class GetByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly channelId: string,
  ) {}
}
