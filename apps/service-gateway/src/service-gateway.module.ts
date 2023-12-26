import { Module } from '@nestjs/common';
import { ServiceGatewayController } from './service-gateway.controller';
import { ServiceGatewayService } from './service-gateway.service';

@Module({
  imports: [],
  controllers: [ServiceGatewayController],
  providers: [ServiceGatewayService],
})
export class ServiceGatewayModule {}
