import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BootstrapModule } from '@skylinetech/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH || 'apps/service-account/.env',
    }),
    BootstrapModule.register({
      path: process.env.CONFIG_FILE_PATH || 'apps/service-account/service.config.yaml',
      plugins: [],
    }),
  ],
})
export class ServiceModule {}
