import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DeliveryModule } from './delivery.module';
import { ValidationPipe } from '@nestjs/common';

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

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();