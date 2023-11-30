import { CreateChannelDto } from '../../dto/request/create-channel.dto';

export class CreateChannelCommand {
  constructor(
    public readonly accountId: string,
    public readonly dto: CreateChannelDto,
  ) {}
}
