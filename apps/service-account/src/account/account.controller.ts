import { Controller } from '@nestjs/common';
import { AccountServiceControllerMethods } from 'libs/protobuf/src/protobufs/account.pb';

@Controller()
@AccountServiceControllerMethods()
export class AccountController {}
