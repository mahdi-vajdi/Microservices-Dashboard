import { Observable } from 'rxjs/internal/Observable';
import {
  AccountExistsRequest,
  AccountExistsResponse,
} from './account-exists.dto';
import { AccountMessageResponse } from './account.dto';
import { GetAccountByEmailRequest } from './get-account-by-email.dto';
import { GetAccountByIdRequest } from './get-account-by-id.dto';

export interface AccountServiceClient {
  getAccountById(
    request: GetAccountByIdRequest,
  ): Observable<AccountMessageResponse>;
  getAccountByEmail(
    request: GetAccountByEmailRequest,
  ): Observable<AccountMessageResponse>;
  accountExists(
    request: AccountExistsRequest,
  ): Observable<AccountExistsResponse>;
}
