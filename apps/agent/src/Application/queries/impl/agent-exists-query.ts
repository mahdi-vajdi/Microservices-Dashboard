export class AgentExistsQuery {
  constructor(
    public readonly email: string,
    public readonly phone: string,
  ) {}
}
