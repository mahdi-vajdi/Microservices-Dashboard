import {
  NATS_AUTH,
  SigninDto,
  JwtPayloadDto,
  SignupDto,
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
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@Controller('auth')
export class AuthHttpController {
  constructor(
    @Inject(NATS_AUTH) private readonly authServiceNats: ClientProxy,
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

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // the refreshToken jwt has been validated by refreshTokenGuard
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
