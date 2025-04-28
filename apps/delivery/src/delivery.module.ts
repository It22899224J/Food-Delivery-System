import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { PrismaService } from './prisma.service';
import { LocationGateway } from './gateways/location.gateway';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService, PrismaService, LocationGateway],
})
export class DeliveryModule {}