import { Module } from '@nestjs/common';
import { ContainerController } from './Presentation/container.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
  ],
  controllers: [ContainerController],
})
export class ContainerModule {}
