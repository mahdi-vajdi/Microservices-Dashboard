import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { AgentRole } from '../dto';
import { Reflector } from '@nestjs/core';
import { ROLES_DECORATOR_KEY } from '../decorators';
import { AuthServiceClient } from '../dto-query';

@Injectable()
export class CommonRefreshTokenGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(CommonRefreshTokenGuard.name);

  private authService: AuthServiceClient;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the refresh token ans see if it's not null
    const refreshToken =
      context.switchToHttp().getRequest().cookies?.refresh_token || null;
    if (!refreshToken) return false;

    const roles = this.reflector.get<AgentRole[]>(
      ROLES_DECORATOR_KEY,
      context.getHandler(),
    );

    return this.authService.authenticateRefreshToken({ refreshToken }).pipe(
      tap((jwtPayload) => {
        // Get the method required method roles and see if user has them
        console.log('requester role: ', jwtPayload.role);
        if (
          roles &&
          !roles.map((role) => role.toString()).includes(jwtPayload.role)
        ) {
          throw new ForbiddenException(
            'The agent does not have the authorization to perform this action',
          );
        }

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
