import { Controller } from '@nestjs/common';
import { AccountServiceControllerMethods } from '@skylinetech/proto/protobufs/account.pb';

@Controller()
@AccountServiceControllerMethods()
export class AccountController {}
