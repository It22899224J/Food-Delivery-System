import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log out the routes
  const routes = app
    .getHttpAdapter()
    .getInstance()
    ._router.stack.filter((layer) => layer.route)
    .map((layer) => layer.route.path);
  console.log('Available Routes:', routes);

  await app.listen(3000);
}

bootstrap();
