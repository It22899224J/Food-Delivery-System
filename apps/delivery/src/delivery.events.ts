// apps/delivery/src/delivery.events.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';

@Controller()
export class DeliveryEvents {
  private readonly logger = new Logger(DeliveryEvents.name);

  constructor(private readonly deliveryService: DeliveryService) {
    this.logger.log('DeliveryEvents initialized');
  }

  @EventPattern('order:created')
  async handleOrderCreated(@Payload() data: {
    orderId: string;
    restaurantId: string;
    deliveryAddress: {
      lat: number;
      lng: number;
    };
  }) {
    this.logger.log('Delivery Events - Received order:created event with data:', JSON.stringify(data));
    try {
      this.logger.log(`Creating delivery for order ${data.orderId}`);

      const restaurantDeatails = await this.deliveryService.getRestaurantDetails(data.restaurantId);

      const delivery = await this.deliveryService.createDelivery({
        orderId: data.orderId,
        startLocation: restaurantDeatails.position,
        endLocation: data.deliveryAddress,
        estimatedTime: 30,
      });

      this.logger.log(`Successfully created delivery: ${JSON.stringify(delivery)}`);
      return delivery;
    } catch (error) {
      this.logger.error(`Failed to create delivery: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      throw error;
    }
  }
}