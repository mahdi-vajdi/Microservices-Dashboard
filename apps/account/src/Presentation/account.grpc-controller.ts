import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { AccountExistsQuery } from '../Application/queries/impl/account-exists.query';
import { QueryBus } from '@nestjs/cqrs';
import { Controller } from '@nestjs/common';
import {
  AccountExistsRequest,
  AccountExistsResponse,
  AccountMessage,
  AccountMessageResponse,
  GetAccountByEmailRequest,
  GetAccountByIdRequest,
} from '@app/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AccountModel } from '../Infrastructure/models/account.model';

/**
 * The class that contains grpc endpoints for account service
 *
 * @export
 * @class AccountGrpcController
 * @typedef {AccountGrpcController}
 */
@Controller()
export class AccountGrpcController {
  /**
   * Creates an instance of AccountGrpcController.
   *
   * @constructor
   * @param {QueryBus} queryBus
   */
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Query an account by its ID
   *
   * @async
   * @param {GetAccountByIdRequest} data
   * @param {Metadata} metadata
   * @param {ServerUnaryCall<any, any>} call
   * @returns {Promise<AccountMessageResponse>}
   */
  @GrpcMethod('AccountService', 'GetAccountById')
  async getAccountById(
    data: GetAccountByIdRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountMessageResponse> {
    const account = await this.queryBus.execute<
      GetByIdQuery,
      AccountModel | null
    >(new GetByIdQuery(data.id));

    if (account)
      return {
        account: this.toAccountMessage(account),
      };
    else return { account: undefined };
  }

  /**
   * Query an account by its Email field
   *
   * @async
   * @param {GetAccountByEmailRequest} data
   * @param {Metadata} metadata
   * @param {ServerUnaryCall<any, any>} call
   * @returns {Promise<AccountMessageResponse>}
   */
  @GrpcMethod('AccountService', 'GetAccountByEmail')
  async getAccountByEmail(
    data: GetAccountByEmailRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<AccountMessageResponse> {
    const account = await this.queryBus.execute<
      GetByEmailQuery,
      AccountModel | null
    >(new GetByEmailQuery(data.email));

    if (account)
      return {
        account: this.toAccountMessage(account),
      };
    else return { account: undefined };
  }

  /**
   * Check if an account with given fields exist.
   *
   * @async
   * @param {AccountExistsRequest} data
   * @param {Metadata} metadata
   * @param {ServerUnaryCall<any, any>} call
   * @returns {Promise<AccountExistsResponse>} will be true if account exists
   */
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

  /**
   * Convert a database account model to grpc account message
   *
   * @private
   * @param {AccountModel} model
   * @returns {AccountMessage}
   */
  private toAccountMessage(model: AccountModel): AccountMessage {
    return {
      id: model._id.toHexString(),
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      email: model.email,
    };
  }
}
