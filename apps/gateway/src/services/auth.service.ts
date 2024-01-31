import {
  AuthSubjects,
  AuthTokensDto,
  RefreshTokensDto,
  SigninDto,
  SignoutDto,
  SignupDto,
} from '@app/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly natsClient: NatsJetStreamClientProxy) {}

  signup(dto: SignupDto, res: Response) {
    return this.natsClient
      .send<AuthTokensDto, SignupDto>({ cmd: AuthSubjects.SIGNUP }, dto)
      .pipe(
        map((tokens) => {
          if (tokens) {
            this.setTokensToCookies(res, tokens);
          } else {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. please sign in',
            );
          }

          return null;
        }),
      );
  }

  signin(dto: SigninDto, res: Response) {
    return this.natsClient
      .send<AuthTokensDto, SigninDto>({ cmd: AuthSubjects.SIGNIN }, dto)
      .pipe(
        map((tokens) => {
          if (tokens) {
            this.setTokensToCookies(res, tokens);
          } else {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. please sign in',
            );
          }

          return null;
        }),
      );
  }

  signout(jwtPayload: JwtPayloadDto, res: Response) {
    this.natsClient.emit<void, SignoutDto>(AuthSubjects.SIGNOUT, {
      agentId: jwtPayload.sub,
    });
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  refreshTokens(
    refreshToken: string,
    jwtPaylaod: JwtPayloadDto,
    res: Response,
  ) {
    return this.natsClient
      .send<AuthTokensDto | null, RefreshTokensDto>(
        { cmd: AuthSubjects.REFRESH_TOKENS },
        {
          agentId: jwtPaylaod.sub,
          refreshToken,
        },
      )
      .pipe(
        map((tokens) => {
          if (tokens) {
            this.setTokensToCookies(res, tokens);
          } else {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. please sign in',
            );
          }

          return null;
        }),
      );
  }

  private setTokensToCookies(res: Response, tokens: AuthTokensDto) {
    res.cookie('access_token', tokens.accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}
