import { Module } from '@nestjs/common';
import { BootstrapModule } from '@skylinetech/core';

@Module({
  imports: [
    BootstrapModule.register({
      path: process.env.configfile || 'apps/service-account/service.config.yaml',
      plugins: [],
    }),
  ],
})
export class ServiceModule {}
