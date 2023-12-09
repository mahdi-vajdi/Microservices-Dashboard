import { Controller, UseGuards } from '@nestjs/common';
import {
  AuthServiceClient,
  AuthServiceControllerMethods,
  AuthenticateAccessTokenDto,
  AuthenticateRefreshTokenDto,
  JwtPayloadDto,
  JwtPayloadMessage,
} from '@app/common';
import { Observable, of } from 'rxjs';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceClient {
  @UseGuards(AccessTokenGuard)
  authenticateAccessToken(
    request: AuthenticateAccessTokenDto,
  ): Observable<JwtPayloadDto> {
    const jwtPayload = request['user'] as JwtPayloadDto;
    return of(jwtPayload);
  }

  @UseGuards(RefreshTokenGuard)
  authenticateRefreshToken(
    request: AuthenticateRefreshTokenDto,
  ): Observable<JwtPayloadMessage> {
    const jwtPayload = request['user'] as JwtPayloadDto;
    return of(jwtPayload);
  }
}
