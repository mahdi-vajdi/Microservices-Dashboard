export class GetChannelByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly channelId: string,
  ) {}
}
