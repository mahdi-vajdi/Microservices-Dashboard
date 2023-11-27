import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtPayload, USER_SERVICE, UserDto } from '@app/common';
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
    @Inject(USER_SERVICE) private readonly userService: ClientProxy,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<Observable<Promise<AuthResponse>>> {
    // check if email or phone exists
    const userExists = await lastValueFrom(
      this.userService.send<boolean>('userExists', {
        email: signupDto.email,
        phone: signupDto.phone,
      }),
    );
    if (userExists) throw new ConflictException('User already exists');

    return this.userService.send<UserDto>('create', signupDto).pipe(
      map(async (user) => {
        // generate tokens for the user
        const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

        // insert the new refresh token in user database
        this.userService.emit<void>('updateRefreshToken', {
          id: user.id,
          token: tokens.refresh_token,
        });

        return {
          email: user.email,
          userId: user.id,
          ...tokens,
        };
      }),
    );
  }

  async signin(user: UserDto): Promise<AuthResponse> {
    const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

    this.userService.emit<void>('updateRefreshToken', {
      id: user.id,
      token: tokens.refresh_token,
    });

    return {
      email: user.email,
      userId: user.id,
      ...tokens,
    };
  }

  signout(user: JwtPayload): void {
    this.userService.emit<void>('updateRefreshToken', {
      id: user.sub,
      token: null,
    });
  }

  async refreshTokens(userPayload: JwtPayload, refreshToken: string) {
    const user = await lastValueFrom(
      this.userService.send<UserDto | null>('getById', {
        id: userPayload.sub,
      }),
    );

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    // const tokenMatches =  await bcrypt.compare(refreshToken, user.refreshToken);
    const tokenMatches = refreshToken === user.refreshToken;

    if (!tokenMatches) throw new ForbiddenException('Acess Denied');

    const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

    this.userService.emit<void>('updateRefreshToken', {
      id: user.id,
      token: tokens.refresh_token,
    });

    return tokens;
  }

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = this.userService.send<UserDto>('getByEmail', { email }).pipe(
      map(async (user) => {
        if (user && (await bcrypt.compare(password, user.password)))
          return user;
        else return null;
      }),
    );

    return await lastValueFrom(user);
  }

  setCookies(
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
