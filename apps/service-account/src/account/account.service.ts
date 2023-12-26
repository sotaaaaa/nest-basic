import { Injectable } from '@nestjs/common';
import {
  AccountServiceClient,
  LoginRequest,
} from '@skylinetech/proto/protobufs/account.pb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccountService {
  constructor(private readonly accountServiceClient: AccountServiceClient) {}

  async login(request: LoginRequest) {
    const response = await firstValueFrom(this.accountServiceClient.login(request));
    response.token;
  }
}
