import { AgentRole } from '@app/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * The helper class for jwt related logic
 */
@Injectable()
export class JwtHelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(
    id: string,
    email: string,
    account: string,
    role: AgentRole,
  ): Promise<AuthTokensDto> {
    const payload: JwtPayloadDto = {
      sub: id,
      email,
      account,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Verify provided access token
   */
  async verifyAccessToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  /**
   * Verify provided refresh token
   */
  async verifyRefreshToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }
}
