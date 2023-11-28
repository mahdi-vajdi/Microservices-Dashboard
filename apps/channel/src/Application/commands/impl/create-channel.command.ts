import { CreateChannelDto } from '../../dto/request/create-channel.dto';

export class CreateChannelCommand {
  constructor(
    public readonly id: string,
    public readonly dto: CreateChannelDto,
  ) {}
}
