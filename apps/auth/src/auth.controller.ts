import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthResponse, AuthService } from './auth.service';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocalAuthGuard } from './guards/local.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload, UserDto } from '@app/common';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto): Observable<Promise<AuthResponse>> {
    return this.authService.signup(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: Request): Promise<AuthResponse> {
    return this.authService.signin(req.user as UserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signout(@Req() req: Request): void {
    return this.authService.signout(req.user as JwtPayload);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return this.authService.refreshTokens(req.user as JwtPayload, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
