export interface AccountMessageResponse {
  account: AccountMessage | undefined;
}

export interface AccountMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
}
