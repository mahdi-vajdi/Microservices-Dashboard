export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly name: string,
    public readonly password: string,
  ) {}
}
