import { Controller } from '@nestjs/common';
import {
  AccountExistsRequest,
  AccountExistsResponse,
  AccountMessageResponse,
  GetAccountByEmailRequest,
  GetAccountByIdRequest,
} from '@app/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AccountService } from '../Application/services/account.service';

/**
 * The class that contains grpc endpoints for account service
 *
 * @export
 * @class AccountGrpcController
 */
@Controller()
export class AccountGrpcController {
  constructor(private readonly accountService: AccountService) {}

  @GrpcMethod('AccountService', 'GetAccountById')
  async getAccountById(
    data: GetAccountByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountMessageResponse> {
    return this.accountService.getAccountById(data.id);
  }

  @GrpcMethod('AccountService', 'GetAccountByEmail')
  async getAccountByEmail(
    data: GetAccountByEmailRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountMessageResponse> {
    return this.accountService.getAccountByEmail(data.email);
  }

  @GrpcMethod('AccountService', 'AccountExists')
  async accountExists(
    data: AccountExistsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountExistsResponse> {
    return this.accountService.accountExists(data.email);
  }
}
