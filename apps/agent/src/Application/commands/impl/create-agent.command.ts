import { AgentRole } from '@app/common';

export class CreateAgentCommand {
  constructor(
    public readonly requesterAccountId: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly title: string,
    public readonly channelIds: string[],
    public readonly password: string,
    public readonly role: AgentRole,
  ) {}
}
