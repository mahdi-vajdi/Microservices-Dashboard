import { Module } from '@nestjs/common';
import { AgentController } from './Presentation/agent.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModel, AgentSchema } from './Infrastructure/models/agent.model';
import { AgentWriteRepository } from './Infrastructure/repositories/agent-write.repo';
import { AgentReadRepository } from './Infrastructure/repositories/agent-read.repo';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        NATS_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: AgentModel.name, schema: AgentSchema }]),
  ],
  controllers: [AgentController],
  providers: [
    { provide: 'AgentRepository', useClass: AgentWriteRepository },
    AgentReadRepository,
  ],
})
export class AgentModule {}
