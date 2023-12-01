import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { AgentRole, JwtPayload } from '../dto';
import { Reflector } from '@nestjs/core';
import { ROLES_DECORATOR_KEY } from '../decorators';

@Injectable()
export class CommonAccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(CommonAccessTokenGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the access token ans see if it's not null
    const accessToken =
      context.switchToHttp().getRequest().cookies?.access_token || null;
    if (!accessToken) return false;

    const roles = this.reflector.get<AgentRole[]>(
      ROLES_DECORATOR_KEY,
      context.getHandler(),
    );

    return this.authService
      .send<JwtPayload>('authenticate', { access_token: accessToken })
      .pipe(
        tap((jwtPayload) => {
          // Get the method required method roles and see if user has them
          console.log('requester role: ', jwtPayload.role);
          if (roles && !roles.includes(jwtPayload.role)) {
            console.debug('roles prevented you');
            throw new ForbiddenException(
              'The agent does not have the authorization to perform this action',
            );
          }

          console.debug('roles granted you');
          context.switchToHttp().getRequest().user = jwtPayload;
        }),
        map(() => true),
        catchError((error) => {
          this.logger.error(error);
          return of(false);
        }),
      );
  }
}
