export class GetByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly channelId: string,
  ) {}
}
