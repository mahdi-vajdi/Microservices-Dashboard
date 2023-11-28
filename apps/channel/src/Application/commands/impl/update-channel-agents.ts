export class UpdateChannelAgentsCommand {
  constructor(
    public readonly userId: string,
    public readonly channelId: string,
    public readonly agentIds: string[],
  ) {}
}
