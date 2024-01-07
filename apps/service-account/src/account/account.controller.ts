import { Controller, Logger } from '@nestjs/common';
import { ServiceToGateway } from '@skylinetech/core';
import {
  AccountServiceController,
  AccountServiceControllerMethods,
  PingServiceResponse,
} from '@skylinetech/protobuf/protobufs/account.pb';

@Controller()
@AccountServiceControllerMethods()
export class AccountController implements AccountServiceController {
  // Health check service account
  @ServiceToGateway()
  pingService(): Promise<PingServiceResponse> {
    Logger.log('Reviced ping service request', Date.now());
    return Promise.resolve({
      serviceIsAlive: true,
      serviceName: 'AccountService',
    });
  }
}
