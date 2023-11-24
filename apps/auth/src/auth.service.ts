import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtPayload, USER_SERVICE, UserDto } from '@app/common';
import { SignupDto } from './dto/signup.dto';
import { ClientProxy } from '@nestjs/microservices';
import { JwtUtils } from './jwt.util';
import { Observable, lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';

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

  signup(signupDto: SignupDto): Observable<Promise<AuthResponse>> {
    return this.userService.send<UserDto>('create', signupDto).pipe(
      map(async (user) => {
        // generate tokens for the user
        const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

        // insert the new refresh token in user
        this.userService.emit<void>('updateRefreshToken', {
          id: user.id,
          token: tokens.refresh_token,
        });
        console.log(`user data ${user.email} ${user.id}`);

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
    return this.userService
      .send<UserDto>('findOneById', {
        id: userPayload.sub,
      })
      .subscribe(async (user) => {
        const doesTokenMatch = await bcrypt.compare(
          refreshToken,
          user.refreshToken,
        );
        if (!doesTokenMatch) throw new ForbiddenException('Access Denied');

        const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

        this.userService.emit<void>('updateRefreshToken', {
          id: user.id,
          token: tokens.refresh_token,
        });

        return tokens;
      });
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = this.userService
      .send<UserDto>('findOneByEmail', { email })
      .pipe(
        map(async (user) => {
          if (user && (await bcrypt.compare(password, user.password)))
            return user;
          else return null;
        }),
      );

    return await lastValueFrom(user);
  }
}
