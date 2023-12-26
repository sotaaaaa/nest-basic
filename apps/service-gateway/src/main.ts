import { NestFactory } from '@nestjs/core';
import { ServiceGatewayModule } from './service-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceGatewayModule);
  await app.listen(3000);
}
bootstrap();
