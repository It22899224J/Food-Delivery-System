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

@WebSocketGateway({
  cors: {
    origin: '*', // Configure according to your needs
  },
  namespace: 'location',
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(LocationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly deliveryService: DeliveryService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('location:update')
  async handleLocationUpdate(client: Socket, payload: { 
    driverId: string;
    latitude: number;
    longitude: number;
  }) {
    try {
      await this.deliveryService.updateDriverLocation(payload.driverId, {
        latitude: payload.latitude,
        longitude: payload.longitude,
      });

      // Broadcast to all connected clients
      this.server.emit(`driver:${payload.driverId}:location`, {
        driverId: payload.driverId,
        location: {
          lat: payload.latitude,
          lng: payload.longitude,
        },
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error updating location: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}