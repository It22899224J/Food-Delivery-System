import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Get('user/:userId')
  async getPaymentsByUserId(@Param('userId') userId: string) {
    return this.paymentService.getPaymentsByUserId(userId);
  }

  @Get('restaurant/:restaurantId')
  async getPaymentsByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.paymentService.getPaymentsByRestaurantId(restaurantId);
  }

  @Post('create-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency?: string },
  ) {
    return this.paymentService.createPaymentIntent(
      body.amount,
      body.currency || 'usd',
    );
  }

  @Post('create-checkout')
  async createCheckoutSession(
    @Body()
    body: {
      lineItems: any[];
      successUrl: string;
      cancelUrl: string;
    },
  ) {
    return this.paymentService.createCheckoutSession(
      body.lineItems,
      body.successUrl,
      body.cancelUrl,
    );
  }

  @Get('intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    return this.paymentService.retrievePaymentIntent(id);
  }

  @Post('refund')
  async createRefund(
    @Body() body: { paymentIntentId: string; amount?: number },
  ) {
    return this.paymentService.createRefund(body.paymentIntentId, body.amount);
  }

  @Post('save')
  async savePayment(
    @Body()
    body: {
      transactionId: string;
      orderId: string;
      userId: string;
      amount: number;
      currency?: string;
      restaurantId: string;
      paymentMethod:string;
    },
  ) {
    return this.paymentService.savePayment(body);
  }
}
