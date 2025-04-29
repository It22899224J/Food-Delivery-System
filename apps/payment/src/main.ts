import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);

  // Enable CORS - This must come BEFORE app.listen()
  app.enableCors({
    origin: '*', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3020,
    },
  });

  // Start microservice
  await app.startAllMicroservices();

  // Start HTTP server
  await app.listen(3006);

  console.log(`Payment service is running on port 3006`);
}
bootstrap();
