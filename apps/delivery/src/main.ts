import { NestFactory } from '@nestjs/core';
import { DeliveryModule } from './delivery.module';

async function bootstrap() {
  const app = await NestFactory.create(DeliveryModule);
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
