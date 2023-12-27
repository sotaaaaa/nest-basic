import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BootstrapModule } from '@skylinetech/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.envfile || 'apps/service-account/.env',
    }),
    BootstrapModule.register({
      path: process.env.configfile || 'apps/service-account/service.config.yaml',
      plugins: [], // Add plugins here
    }),
  ],
})
export class ServiceModule {}
