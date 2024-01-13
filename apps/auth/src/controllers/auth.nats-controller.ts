import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {
  AuthSubjects,
  AuthTokensDto,
  RefreshTokensDto,
  SigninDto,
  SignoutDto,
  SignupDto,
} from '@app/common';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthSubjects.SIGNUP })
  async signup(@Payload() signupDto: SignupDto): Promise<AuthTokensDto> {
    return await this.authService.signup(signupDto);
  }

  @MessagePattern({ cmd: AuthSubjects.SIGNIN })
  async signin(@Payload() dto: SigninDto): Promise<AuthTokensDto> {
    return await this.authService.signin(dto);
  }

  @EventPattern(AuthSubjects.SIGNOUT)
  signout(
    @Payload() { agentId }: SignoutDto,
    @Ctx() context: NatsJetStreamContext,
  ): void {
    context.message.ack();
    this.authService.signout(agentId);
  }

  @MessagePattern({ cmd: AuthSubjects.REFRESH_TOKENS })
  async refresh(
    @Payload() { agentId, refreshToken }: RefreshTokensDto,
  ): Promise<AuthTokensDto> {
    return await this.authService.refreshTokens(agentId, refreshToken);
  }
}
