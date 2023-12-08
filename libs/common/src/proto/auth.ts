/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface AuthenticateAccessTokenMessage {
  accessToken: string;
}

export interface AuthenticateRefreshTokenMessage {
  refreshToken: string;
}

export interface JwtPayloadMessage {
  sub: string;
  email: string;
  account: string;
  role: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  authenticateAccessToken(request: AuthenticateAccessTokenMessage): Observable<JwtPayloadMessage>;

  authenticateRefreshToken(request: AuthenticateRefreshTokenMessage): Observable<JwtPayloadMessage>;
}

export interface AuthServiceController {
  authenticateAccessToken(
    request: AuthenticateAccessTokenMessage,
  ): Promise<JwtPayloadMessage> | Observable<JwtPayloadMessage> | JwtPayloadMessage;

  authenticateRefreshToken(
    request: AuthenticateRefreshTokenMessage,
  ): Promise<JwtPayloadMessage> | Observable<JwtPayloadMessage> | JwtPayloadMessage;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["authenticateAccessToken", "authenticateRefreshToken"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
