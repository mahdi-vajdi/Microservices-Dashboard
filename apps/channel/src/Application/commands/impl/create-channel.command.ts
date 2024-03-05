export class CreateChannelCommand {
  constructor(
    public readonly accountId: string,
    public readonly title: string,
    public readonly url: string,
    public readonly token: string,
    public readonly agents: string[],
  ) {}
}
