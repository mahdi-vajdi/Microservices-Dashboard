export class UpdateChannelAgentsCommand {
  constructor(
    public readonly accountId: string,
    public readonly channelId: string,
    public readonly agentIds: string[],
  ) {}
}
