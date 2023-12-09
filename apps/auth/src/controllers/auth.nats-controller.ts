import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthTokensDto,
  RefreshTokensDto,
  SigninDto,
  SignoutDto,
  SignupDto,
} from '@app/common';

@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signup')
  async signup(@Payload() signupDto: SignupDto): Promise<AuthTokensDto | null> {
    return await this.authService.signup(signupDto);
  }

  @MessagePattern('signin')
  async signin(@Payload() dto: SigninDto): Promise<AuthTokensDto | null> {
    return await this.authService.signin(dto);
  }

  @EventPattern('signout')
  signout(@Payload() { agentId }: SignoutDto): void {
    this.authService.signout(agentId);
  }

  @MessagePattern('refreshTokens')
  async refresh(@Payload() { agentId, refreshToken }: RefreshTokensDto) {
    return await this.authService.refreshTokens(agentId, refreshToken);
  }
}
