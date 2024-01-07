import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skylinetech/core';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-gateway/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-gateway/.env',
    }),
    HealthModule,
  ],
})
export class ServiceModule {}
