import { CreateChannelDto } from '../../dto/create-channel.dto';

export class CreateChannelCommand {
  constructor(public readonly dto: CreateChannelDto) {}
}
