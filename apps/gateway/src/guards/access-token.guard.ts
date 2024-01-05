import { AgentRole, AuthServiceClient, ROLES_DECORATOR_KEY } from '@app/common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class AccessTokenGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(AccessTokenGuard.name);

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
    // Get the access token ans see if it's not null
    const accessToken =
      context.switchToHttp().getRequest().cookies?.access_token || null;
    if (!accessToken) return false;

    const roles = this.reflector.get<AgentRole[]>(
      ROLES_DECORATOR_KEY,
      context.getHandler(),
    );

    return this.authService.authenticateAccessToken({ accessToken }).pipe(
      tap((jwtPayload) => {
        // Get the method required method roles and see if user has them
        if (roles && !roles.includes(AgentRole[jwtPayload.role])) {
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
