import { Controller } from '@nestjs/common';
import {
  VerifyAccessTokenMessage,
  VerifyRefreshTokenMessage,
  JwtPayloadMessage,
} from '@app/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { JwtHelperService } from '../services/jwt-helper.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * The Controller that handles the queries via grpc
 *
 * @export
 * @class AuthGrpcController
 * @typedef {AuthGrpcController}
 */
@Controller()
export class AuthGrpcController {
  constructor(private readonly jwtService: JwtHelperService) {}

  @GrpcMethod('AuthService', 'VerifyAccessToken')
  async verifyAccessToken(
    data: VerifyAccessTokenMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<JwtPayloadMessage> {
    try {
      const payload = await this.jwtService.verifyAccessToken(data.accessToken);
      return this.toJwtPayloadMessage(payload);
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message,
      });
    }
  }

  @GrpcMethod('AuthService', 'VerifyRefreshToken')
  async verifyRefreshToken(
    data: VerifyRefreshTokenMessage,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<JwtPayloadMessage> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(
        data.refreshToken,
      );
      return this.toJwtPayloadMessage(payload);
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message,
      });
    }
  }

  private toJwtPayloadMessage(dto: JwtPayloadDto): JwtPayloadMessage {
    return {
      sub: dto.sub,
      account: dto.account,
      email: dto.email,
      role: dto.role.toString(),
    };
  }
}
