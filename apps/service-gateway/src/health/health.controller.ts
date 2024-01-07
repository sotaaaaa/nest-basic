import { Controller, Get } from '@nestjs/common';
import { GatewayToClient } from '@skylinetech/core/decorators';
import { ClientGrpcService } from '@skylinetech/plugins';
import {
  ACCOUNT_SERVICE_NAME,
  AccountServiceClient,
} from '@skylinetech/protobuf/protobufs/account.pb';

@Controller()
export class HealthController {
  @ClientGrpcService('AccountService', ACCOUNT_SERVICE_NAME)
  private readonly accountService: AccountServiceClient;

  // Health check service account
  @Get('/services/account/ping')
  @GatewayToClient()
  async pingServiceAccount(): Promise<any> {
    const response = await this.accountService.pingService({}).toPromise();
    return response;
  }
}
