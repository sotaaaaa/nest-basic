import { NestFactory } from '@nestjs/core';
import { ServiceAccountModule } from './service-account.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceAccountModule);
  await app.listen(3000);
}
bootstrap();
