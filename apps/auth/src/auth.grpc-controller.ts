import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AgentRole,
  AuthServiceClient,
  AuthServiceControllerMethods,
  AuthenticateAccessTokenDto,
  AuthenticateRefreshTokenDto,
  JwtPayloadDto,
  JwtPayloadMessage,
} from '@app/common';
import { Observable, of } from 'rxjs';
import { AccessTokenGuard } from './guards/access-token.guard';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceClient {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  authenticateAccessToken(
    request: AuthenticateAccessTokenDto,
  ): Observable<JwtPayloadDto> {
    console.debug(JSON.stringify(request));
    return of({
      sub: 'dfgfgd',
      email: '',
      account: '',
      role: AgentRole.ADMIN,
    });
  }

  authenticateRefreshToken(
    request: AuthenticateRefreshTokenDto,
  ): Observable<JwtPayloadMessage> {
    console.debug(JSON.stringify(request));
    return of({
      sub: 'dfgfgd',
      email: '',
      account: '',
      role: AgentRole.ADMIN,
    });
  }
}
