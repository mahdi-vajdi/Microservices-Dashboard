import { Module } from '@nestjs/common';
import { UserController } from './Presentation/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import {
  USER_DB_COLLECTION,
  UserSchema,
} from './Infrastructure/models/user.model';
import { CqrsModule } from '@nestjs/cqrs';
import { UserWriteRepository } from './Infrastructure/repositories/user.write-repo';
import { UserCommandHandlers } from './Application/commands/handlers';
import { UserQueryHandlers } from './Application/queries/handlers';
import { UserEventHandlers } from './Application/events/handlers';
import { UserReadRepository } from './Infrastructure/repositories/user.read-repo';

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
    MongooseModule.forFeature([
      { name: USER_DB_COLLECTION, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserReadRepository,
    { provide: 'UserRepository', useClass: UserWriteRepository },
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
  ],
})
export class UserModule {}
