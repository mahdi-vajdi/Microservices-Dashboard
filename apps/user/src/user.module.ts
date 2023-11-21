import { Module } from '@nestjs/common';
import { UserController } from './Presentation/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './Infrastructure/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
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
  providers: [],
})
export class UserModule {}
