import { NestFactory } from '@nestjs/core';
import { AppModule } from './apiGateway.module';
import { ValidationPipe } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS (configure as needed)
  app.enableCors({
    origin: true, // Or specify your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // JWT token validation function
  const isTokenValid = (token: string): boolean => {
    try {
      // Skip 'Bearer ' prefix if present
      const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const payload = JSON.parse(Buffer.from(actualToken.split('.')[1], 'base64').toString());
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  // JWT verification middleware
  app.use((req: Request, res: Response, next: Function) => {
    // Skip authentication for auth routes and OPTIONS requests
    if (
      req.path.startsWith('/auth') ||
      (req.path.startsWith('/restaurants') && req.method === 'GET')
    ) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    // Validate the token
    if (!isTokenValid(authHeader)) {
      return res.status(401).json({ message: 'Token expired or invalid' });
    }

    // Token is valid, proceed to the next middleware
    next();
  });

  // Proxy configuration
  const services = {
    '/restaurants': 'http://restaurant:3000/restaurants',
    '/food-items': 'http://restaurant:3000',
    '/deliveries': 'http://delivery-service:3002/deliveries',
    '/orders': 'http://order-service:3004',
    '/notification': 'http://notification-service:3015/notification',
    '/payments': 'http://payment-service:3006',
    '/auth': 'http://auth-service:3012/auth',
  };

  // Set up proxies for each service
  for (const [path, target] of Object.entries(services)) {
    app.use(
      path,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^${path}`]: '',
        },
        on: {
          proxyReq: (proxyReq, req) => {
            console.log(
              `Proxying ${req.method} request to: ${target}${req.url}`,
            );
          },
        },
      }),
    );
  }

  const PORT = process.env.PORT || 3025;
  await app.listen(PORT);
  console.log(`API Gateway running on port ${PORT}`);
}

bootstrap();
