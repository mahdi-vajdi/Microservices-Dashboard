import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { AccountDto } from '@app/common/dto/account.dto';
import { GetByEmailQuery } from '../Application/queries/impl/get-by-email.query';
import { AccountExistsQuery } from '../Application/queries/impl/account-exists.query';
import { QueryBus } from '@nestjs/cqrs';
import { Controller } from '@nestjs/common';
import {
  AccountExistsResponse,
  AccountMessageResponse,
  AccountServiceClient,
  AuthServiceControllerMethods,
  GetAccountByEmailDto,
  GetAccountByIdDto,
} from '@app/common';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/operators';

@Controller()
@AuthServiceControllerMethods()
export class AccountGrpcController implements AccountServiceClient {
  constructor(private readonly queryBus: QueryBus) {}

  getAccountById(
    request: GetAccountByIdDto,
  ): Observable<AccountMessageResponse> {
    return from(
      this.queryBus.execute<GetByIdQuery, AccountDto | null>(
        new GetByIdQuery(request.id),
      ),
    ).pipe(
      map((account) => {
        if (account) return { account };
        else return { account: undefined };
      }),
    );
  }

  getAccountByEmail(
    request: GetAccountByEmailDto,
  ): Observable<AccountMessageResponse> {
    return from(
      this.queryBus.execute<GetByEmailQuery, AccountDto | null>(
        new GetByEmailQuery(request.email),
      ),
    ).pipe(
      map((account) => {
        if (account) return { account };
        else return { account: undefined };
      }),
    );
  }

  accountExists(
    request: GetAccountByEmailDto,
  ): Observable<AccountExistsResponse> {
    return from(
      this.queryBus.execute<AccountExistsQuery, boolean>(
        new AccountExistsQuery(request.email),
      ),
    ).pipe(
      map((exists) => {
        return { exists };
      }),
    );
  }
}
