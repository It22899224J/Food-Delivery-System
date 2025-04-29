import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentEvents {
  private readonly logger = new Logger(PaymentEvents.name);

  constructor(private readonly paymentService: PaymentService) {
    this.logger.log('PaymentEvents initialized');
  }

  @MessagePattern('payment:save')
  async handleSavePayment(@Payload() data: {
    transactionId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency?: string;
    restaurantId: string;
    paymentMethod: string;
  }) {
    this.logger.log('Payment Events - Received payment:save event with data:', JSON.stringify(data));
    try {
      this.logger.log(`Saving payment for order ${data.orderId}`);
      const payment = await this.paymentService.savePayment(data);
      this.logger.log(`Successfully saved payment: ${JSON.stringify(payment)}`);
      return payment;
    } catch (error) {
      this.logger.error(`Failed to save payment: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      throw error;
    }
  }
}