import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe('sk_test_51RIb3MBVWky9Ykn8nJ05XPR7CtXLmQPYCNsLatmYaxjrXrYSMQ2XD6HuWVt6AL653JJRGiaaadbJaeJ3QaYpPEJD00RqhT1Fqo', {
      apiVersion: '2025-03-31.basil', // Use the version expected by the package
    });
  }

  getHello(): string {
    return 'Hello from Payment Service!';
  }

  /**
   * Create a payment intent
   * @param amount Amount in cents (e.g., 1000 for $10.00)
   * @param currency Currency code (e.g., 'usd')
   */
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        // Add additional parameters as needed
      });
      
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }

  /**
   * Create a checkout session
   * @param lineItems Products to be purchased
   * @param successUrl URL to redirect after successful payment
   * @param cancelUrl URL to redirect after canceled payment
   */
  async createCheckoutSession(lineItems: any[], successUrl: string, cancelUrl: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      
      return session;
    } catch (error) {
      throw new Error(`Error creating checkout session: ${error.message}`);
    }
  }

  /**
   * Retrieve a payment intent
   * @param id Payment intent ID
   */
  async retrievePaymentIntent(id: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(id);
    } catch (error) {
      throw new Error(`Error retrieving payment intent: ${error.message}`);
    }
  }

  /**
   * Create a refund
   * @param paymentIntentId Payment intent ID to refund
   * @param amount Amount to refund (optional, refunds entire amount if not specified)
   */
  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refundParams: any = { payment_intent: paymentIntentId };
      
      if (amount) {
        refundParams.amount = amount;
      }
      
      return await this.stripe.refunds.create(refundParams);
    } catch (error) {
      throw new Error(`Error creating refund: ${error.message}`);
    }
  }
}
