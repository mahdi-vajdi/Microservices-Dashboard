import { Observable } from 'rxjs/internal/Observable';
import { JwtPayloadMessage } from './jwt-payload.dto';
import { AuthenticateAccessTokenMessage } from './auth-access.dto';
import { AuthenticateRefreshTokenMessage } from './auth-refresh.dto';

export interface AuthServiceClient {
  authenticateAccessToken(
    request: AuthenticateAccessTokenMessage,
  ): Observable<JwtPayloadMessage>;
  authenticateRefreshToken(
    request: AuthenticateRefreshTokenMessage,
  ): Observable<JwtPayloadMessage>;
}
