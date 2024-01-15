import { Observable } from 'rxjs/internal/Observable';
import { JwtPayloadMessage } from './jwt-payload.dto';
import { VerifyAccessTokenMessage } from './auth-access.dto';
import { VerifyRefreshTokenMessage } from './auth-refresh.dto';

export interface AuthServiceClient {
  verifyAccessToken(
    request: VerifyAccessTokenMessage,
  ): Observable<JwtPayloadMessage>;
  verifyRefreshToken(
    request: VerifyRefreshTokenMessage,
  ): Observable<JwtPayloadMessage>;
}
