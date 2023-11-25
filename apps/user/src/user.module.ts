import { Module } from '@nestjs/common';
import { UserController } from './Presentation/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './Infrastructure/user.model';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoUserWriteRepository } from './Infrastructure/mongo-user.write-repo';
import { UserRepository } from './Domain/abstract-user.repo';
import { UserFactory } from './Domain/user.factory';
import { UserCommandHandlers } from './Application/commands/handlers';
import { UserQueryHandlers } from './Application/queries/handlers';
import { UserEventHandlers } from './Application/events/handler';
import { MongoUserReadRepository } from './Infrastructure/mongo-user.read-repo';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        NATS_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    MongoUserReadRepository,
    { provide: UserRepository, useClass: MongoUserWriteRepository },
    UserFactory,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
  ],
})
export class UserModule {}
