import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthResponse, AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocalAuthGuard } from './guards/local.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload, UserDto } from '@app/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Body() signupDto: SignupDto,
  ): Promise<Observable<Promise<AuthResponse>>> {
    return this.authService.signup(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.signin(req.user as UserDto);
    this.authService.setCookies(res, tokens);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.signout(req.user as JwtPayload);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;
    const newTokens = await this.authService.refreshTokens(
      req.user as JwtPayload,
      refreshToken,
    );
    this.authService.setCookies(res, newTokens);
  }

  @UseGuards(AccessTokenGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

  private;
}
