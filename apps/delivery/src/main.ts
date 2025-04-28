import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DeliveryModule } from './delivery.module';

async function bootstrap() {
  // HTTP server
  const app = await NestFactory.create(DeliveryModule);
  
  // Microservice for TCP events
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'delivery-service', // Changed from 0.0.0.0 to service name
      port: 3003,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();