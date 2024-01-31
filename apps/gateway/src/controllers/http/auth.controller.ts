import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';
import { SignupDto as HtppSignupDto } from '../../dto/auth/signup.dto';
import { SigninDto as HtppSigninDto } from '../../dto/auth/signin.dto';
import { AccessTokenGuard } from '../../guards/access-token.guard';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { AuthService } from '../../services/auth.service';

@Controller('auth')
export class AuthHttpController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupDto: HtppSignupDto,
  ) {
    return this.authService.signup(signupDto, res);
  }

  @Post('signin')
  signin(
    @Res({ passthrough: true }) res: Response,
    @Body() signinDto: HtppSigninDto,
  ) {
    return this.authService.signin(signinDto, res);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): void {
    const jwtPayload = req['user'] as JwtPayloadDto;
    this.authService.signout(jwtPayload, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // the refreshToken jwt has been validated by refreshTokenGuard
    const refreshToken = req.cookies.refresh_token;
    const jwtPayload = req['user'] as JwtPayloadDto;
    return this.authService.refreshTokens(refreshToken, jwtPayload, res);
  }
}
