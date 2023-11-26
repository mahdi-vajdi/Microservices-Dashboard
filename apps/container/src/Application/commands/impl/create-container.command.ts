import { CreateContainerDto } from '../../dto/create-container.dto';

export class CreateContainerCommand {
  constructor(
    public readonly id: string,
    public readonly dto: CreateContainerDto,
  ) {}
}
