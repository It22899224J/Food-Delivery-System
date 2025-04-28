import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeliveryService } from '../delivery.service';
import { Logger } from '@nestjs/common';

interface OrderCreatedEvent {
  orderId: string;
  restaurantId: string;
  deliveryAddress: {
    lat: number;
    lng: number;
  };
  estimatedTime?: number;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Configure according to your needs
  },
  namespace: 'orders',
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(OrderGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly deliveryService: DeliveryService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('order:created')
  async handleOrderCreated(client: Socket, payload: OrderCreatedEvent) {
    console.log('Order Gateway - Received order:created event:', payload);
    try {
      // Get order details from Order service
      const orderDetails = await this.deliveryService.getOrderDetails(payload.orderId);

      const restaurantDeatails = await this.deliveryService.getRestaurantDetails(payload.restaurantId);
      
      // Create delivery with hardcoded start location
      const delivery = await this.deliveryService.createDelivery({
        orderId: payload.orderId,
        startLocation: restaurantDeatails.position,
        endLocation: payload.deliveryAddress,
        estimatedTime: payload.estimatedTime,
      });
  
      // Emit event to notify about delivery creation
      this.server.emit(`order:${payload.orderId}:delivery-created`, {
        deliveryId: delivery.id,
        status: delivery.status,
        driverId: delivery.driverId,
      });
  
      // Notify the driver about new assignment
      if (delivery.driverId) {
        this.server.emit(`driver:${delivery.driverId}:assigned`, {
          deliveryId: delivery.id,
          orderId: payload.orderId,
          pickup: restaurantDeatails.position,
          dropoff: payload.deliveryAddress,
        });
      }

      return { success: true, deliveryId: delivery.id };
    } catch (error) {
      this.logger.error(`Error creating delivery: ${error.message}`);
      
      // Emit error event
      this.server.emit(`order:${payload.orderId}:delivery-failed`, {
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('order:cancelled')
  async handleOrderCancelled(client: Socket, orderId: string) {
    try {
      const delivery = await this.deliveryService.findDeliveryByOrderId(orderId);
      if (delivery) {
        await this.deliveryService.updateDelivery(delivery.id, {
          status: 'CANCELLED',
        });

        // Notify the driver about cancellation
        if (delivery.driverId) {
          this.server.emit(`driver:${delivery.driverId}:cancelled`, {
            deliveryId: delivery.id,
            orderId: orderId,
          });
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error cancelling delivery: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}