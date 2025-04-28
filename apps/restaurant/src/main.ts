import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './restaurant.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
