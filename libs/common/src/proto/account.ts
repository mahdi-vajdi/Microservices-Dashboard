/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";

export const protobufPackage = "account";

export interface GetAccountByIdRequest {
  id: string;
}

export interface GetAccountByEmailRequest {
  email: string;
}

export interface AccountMessageResponse {
  account: AccountMessage | undefined;
}

export interface AccountMessage {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  email: string;
}

export interface AccountExistsRequest {
  email: string;
}

export interface AccountExistsResponse {
  exists: boolean;
}

export const ACCOUNT_PACKAGE_NAME = "account";

wrappers[".google.protobuf.Timestamp"] = {
  fromObject(value: Date) {
    return { seconds: value.getTime() / 1000, nanos: (value.getTime() % 1000) * 1e6 };
  },
  toObject(message: { seconds: number; nanos: number }) {
    return new Date(message.seconds * 1000 + message.nanos / 1e6);
  },
} as any;

export interface AccountServiceClient {
  getAccountById(request: GetAccountByIdRequest): Observable<AccountMessageResponse>;

  getAccountByEmail(request: GetAccountByEmailRequest): Observable<AccountMessageResponse>;

  accountExists(request: AccountExistsRequest): Observable<AccountExistsResponse>;
}

export interface AccountServiceController {
  getAccountById(
    request: GetAccountByIdRequest,
  ): Promise<AccountMessageResponse> | Observable<AccountMessageResponse> | AccountMessageResponse;

  getAccountByEmail(
    request: GetAccountByEmailRequest,
  ): Promise<AccountMessageResponse> | Observable<AccountMessageResponse> | AccountMessageResponse;

  accountExists(
    request: AccountExistsRequest,
  ): Promise<AccountExistsResponse> | Observable<AccountExistsResponse> | AccountExistsResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAccountById", "getAccountByEmail", "accountExists"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCOUNT_SERVICE_NAME = "AccountService";
