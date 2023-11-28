import { IsMongoId } from 'class-validator';
import { CreateAgentDto } from './create-agent.dto';

export class NatsCreateAgentDto extends CreateAgentDto {
  @IsMongoId()
  userId: string;
}
