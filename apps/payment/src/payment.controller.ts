import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello();
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency?: string }) {
    const { amount, currency = 'usd' } = body;
    return this.paymentService.createPaymentIntent(amount, currency);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { 
      lineItems: any[]; 
      successUrl: string; 
      cancelUrl: string;
    }
  ) {
    const { lineItems, successUrl, cancelUrl } = body;
    return this.paymentService.createCheckoutSession(lineItems, successUrl, cancelUrl);
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    return this.paymentService.retrievePaymentIntent(id);
  }

  @Post('refund')
  async createRefund(@Body() body: { paymentIntentId: string; amount?: number }) {
    const { paymentIntentId, amount } = body;
    return this.paymentService.createRefund(paymentIntentId, amount);
  }
}
