import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from './prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DELIVERY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'delivery-service',
          port: 3003,
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'payment-service',
          port: 3020,
        },
      },
    ]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
