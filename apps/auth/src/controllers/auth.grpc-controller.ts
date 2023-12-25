import { Controller, UseGuards } from '@nestjs/common';
import {
  AuthenticateAccessTokenMessage,
  AuthenticateRefreshTokenMessage,
  JwtPayloadMessage,
} from '@app/common';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller()
export class AuthGrpcController {
  @UseGuards(AccessTokenGuard)
  @GrpcMethod('AuthService', 'AuthenticateAccessToken')
  authenticateAccessToken(
    data: AuthenticateAccessTokenMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): JwtPayloadMessage {
    const jwtPayload = call.request['user'] as JwtPayloadMessage;
    return jwtPayload;
  }

  @UseGuards(RefreshTokenGuard)
  @GrpcMethod('AuthService', 'AuthenticateRefreshToken')
  authenticateRefreshToken(
    data: AuthenticateRefreshTokenMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): JwtPayloadMessage {
    const jwtPayload = call.request['user'] as JwtPayloadMessage;
    return jwtPayload;
  }
}
