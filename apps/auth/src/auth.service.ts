import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AGENT_SERVICE, JwtPayload, AgentDto } from '@app/common';
import { SignupDto } from './dto/signup.dto';
import { ClientProxy } from '@nestjs/microservices';
import { JwtUtils } from './jwt.util';
import { Observable, lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

export type AuthResponse = {
  email: string;
  userId: string;
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(AGENT_SERVICE) private readonly agentService: ClientProxy,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<Observable<Promise<AuthResponse>>> {
    // check if email or phone exists
    const userExists = await lastValueFrom(
      this.agentService.send<boolean>('agentExists', {
        email: signupDto.email,
        phone: signupDto.phone,
      }),
    );
    if (userExists) throw new ConflictException('User already exists');

    return this.agentService.send<AgentDto>('createOwnerAgent', signupDto).pipe(
      map(async (user) => {
        // generate tokens for the user
        const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

        // insert the new refresh token in user database
        this.agentService.emit<void>('updateRefreshToken', {
          agentId: user.id,
          newToken: tokens.refresh_token,
        });

        return {
          email: user.email,
          userId: user.id,
          ...tokens,
        };
      }),
    );
  }

  async signin(user: AgentDto): Promise<AuthResponse> {
    const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

    this.agentService.emit<void>('updateRefreshToken', {
      agentId: user.id,
      newToken: tokens.refresh_token,
    });

    return {
      email: user.email,
      userId: user.id,
      ...tokens,
    };
  }

  signout(user: JwtPayload): void {
    this.agentService.emit<void>('updateRefreshToken', {
      agentId: user.sub,
      newToken: null,
    });
  }

  async refreshTokens(userPayload: JwtPayload, refreshToken: string) {
    const user = await lastValueFrom(
      this.agentService.send<AgentDto | null>('getAgentById', {
        agentId: userPayload.sub,
      }),
    );

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    // const tokenMatches =  await bcrypt.compare(refreshToken, user.refreshToken);
    const tokenMatches = refreshToken === user.refreshToken;

    if (!tokenMatches) throw new ForbiddenException('Acess Denied');

    const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

    this.agentService.emit<void>('updateRefreshToken', {
      agentId: user.id,
      newToken: tokens.refresh_token,
    });

    return tokens;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AgentDto | null> {
    const user = this.agentService.send<AgentDto>('getByEmail', { email }).pipe(
      map(async (user) => {
        if (user && (await bcrypt.compare(password, user.password)))
          return user;
        else return null;
      }),
    );

    return await lastValueFrom(user);
  }

  setTokensToCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie('access_token', tokens.access_token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}
