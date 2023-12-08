import {
  AUTH_SERVICE,
  SigninDto,
  CommonAccessTokenGuard,
  JwtPayloadDto,
  SignupDto,
  CommonRefreshTokenGuard,
  RefreshTokensDto,
  SignoutDto,
} from '@app/common';
import { AuthTokensDto } from '@app/common';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthHttpGateway {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authServiceNats: ClientProxy,
  ) {}

  @Post('signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupDto: SignupDto,
  ): Promise<void> {
    const tokens = await lastValueFrom(
      this.authServiceNats.send<AuthTokensDto | null, SignupDto>(
        'signup',
        signupDto,
      ),
    );
    if (tokens) {
      this.setTokensToCookies(res, tokens);
      res.sendStatus(200);
    } else throw new InternalServerErrorException('Invalid Credentials');
  }

  @Post('signin')
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() signinDto: SigninDto,
  ): Promise<void> {
    const tokens = await lastValueFrom(
      this.authServiceNats.send<AuthTokensDto | null, SigninDto>(
        'signin',
        signinDto,
      ),
    );
    if (tokens) {
      this.setTokensToCookies(res, tokens);
      res.sendStatus(200);
    } else throw new UnauthorizedException('Invalid Credentials');
  }

  @UseGuards(CommonAccessTokenGuard)
  @Post('signout')
  signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): void {
    const user = req['user'] as JwtPayloadDto;
    this.authServiceNats.emit<void, SignoutDto>('signout', {
      agentId: user.sub,
    });
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  @UseGuards(CommonRefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;
    const user = req['user'] as JwtPayloadDto;
    const newTokens = await lastValueFrom(
      this.authServiceNats.send<AuthTokensDto | null, RefreshTokensDto>(
        'refreshTokens',
        {
          agentId: user.sub,
          refreshToken,
        },
      ),
    );
    if (newTokens) {
      this.setTokensToCookies(res, newTokens);
      res.sendStatus(200);
    } else throw new ForbiddenException('Access Denied');
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
