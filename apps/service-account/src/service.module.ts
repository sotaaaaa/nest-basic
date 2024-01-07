import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skylinetech/core';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-account/service.config.yaml',
      envFilePath: 'apps/service-account/.env',
    }),

    // Add your modules here
    AccountModule,
  ],
})
export class ServiceModule {}
