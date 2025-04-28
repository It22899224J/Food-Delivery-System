import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('driver/order')
  async notifyDriver(@Body() data: { email: string; orderDetails: any }) {
    return this.notificationService.sendDriverOrderNotification(
      data.email,
      data.orderDetails,
    );
  }

  @Post('customer/confirmation')
  async notifyCustomerConfirmation(
    @Body() data: { email: string; orderDetails: any },
  ) {
    return this.notificationService.sendCustomerOrderConfirmation(
      data.email,
      data.orderDetails,
    );
  }

  @Post('customer/delivered')
  async notifyCustomerDelivered(
    @Body() data: { email: string; orderDetails: any },
  ) {
    return this.notificationService.sendCustomerDeliveryComplete(
      data.email,
      data.orderDetails,
    );
  }

  @Post('restaurant/order')
  async notifyRestaurant(@Body() data: { email: string; orderDetails: any }) {
    return this.notificationService.sendRestaurantOrderNotification(
      data.email,
      data.orderDetails,
    );
  }
}
