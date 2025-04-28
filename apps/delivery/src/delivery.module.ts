import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryEvents } from './delivery.events';
import { OrderGateway } from './gateways/order.gateway';
import { LocationGateway } from './gateways/location.gateway';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [DeliveryController, DeliveryEvents],
  providers: [DeliveryService, OrderGateway, LocationGateway],
})
export class DeliveryModule {}