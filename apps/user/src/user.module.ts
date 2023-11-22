import { Module } from '@nestjs/common';
import { UserController } from './Presentation/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './Infrastructure/user.model';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoUserRepository } from './Infrastructure/mongo-user.repo';
import { UserRepository } from './Domain/user-repo.abstract';
import { UserFactory } from './Domain/user.factory';
import { UserCommandHandlers } from './Application/commands/handlers';
import { UserEventHandlers } from './Application/events/handler';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
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
    { provide: UserRepository, useClass: MongoUserRepository },
    UserFactory,
    ...UserCommandHandlers,
    ...UserEventHandlers,
  ],
})
export class UserModule {}
