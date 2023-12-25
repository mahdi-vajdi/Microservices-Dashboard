import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { AccountDto } from '@app/common/dto/account.dto';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { AccountExistsQuery } from '../Application/queries/impl/account-exists.query';
import { QueryBus } from '@nestjs/cqrs';
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

@Controller()
export class AccountGrpcController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod('AccountService', 'GetAccountById')
  async getAccountById(
    data: GetAccountByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountMessageResponse> {
    const account = await this.queryBus.execute<
      GetByIdQuery,
      AccountDto | null
    >(new GetByIdQuery(data.id));

    if (account)
      return {
        account: {
          ...account,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
        },
      };
    else return { account: undefined };
  }

  @GrpcMethod('AccountService', 'GetAccountByEmail')
  async getAccountByEmail(
    data: GetAccountByEmailRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountMessageResponse> {
    const account = await this.queryBus.execute<
      GetByEmailQuery,
      AccountDto | null
    >(new GetByEmailQuery(data.email));

    if (account)
      return {
        account: {
          ...account,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
        },
      };
    else return { account: undefined };
  }

  @GrpcMethod('AccountService', 'AccountExists')
  async accountExists(
    data: AccountExistsRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountExistsResponse> {
    const exists = await this.queryBus.execute<AccountExistsQuery, boolean>(
      new AccountExistsQuery(data.email),
    );

    return { exists };
  }
}
