import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private prisma = new PrismaClient();

  constructor() {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe(
      'sk_test_51RIb3MBVWky9Ykn8nJ05XPR7CtXLmQPYCNsLatmYaxjrXrYSMQ2XD6HuWVt6AL653JJRGiaaadbJaeJ3QaYpPEJD00RqhT1Fqo',
      {
        apiVersion: '2025-03-31.basil', // Use the version expected by the package
      },
    );
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
  async createCheckoutSession(
    lineItems: any[],
    successUrl: string,
    cancelUrl: string,
  ) {
    try {
      console.log('Started payment session');
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

  /**
   * Save payment information
   * @param data Payment data to save
   */
  async savePayment(data: {
    transactionId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency?: string;
    restaurantId: string;
    paymentMethod: string;
  }) {
    try {
      // Create a new payment record in the database using Prisma
      const payment = await this.prisma.payment.create({
        data: {
          transactionId: data.transactionId,
          orderId: data.orderId,
          userId: data.userId,
          amount: data.amount,
          currency: data.currency || 'USD',
          restaurantId: data.restaurantId,
          paymentMethod: data.paymentMethod,
        },
      });

      return payment;
    } catch (error) {
      throw new Error(`Error saving payment: ${error.message}`);
    }
  }

  /**
   * Get all payments
   * @returns All payment records
   */
  async getAllPayments() {
    try {
      const payments = await this.prisma.payment.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return payments;
    } catch (error) {
      throw new Error(`Error retrieving payments: ${error.message}`);
    }
  }

  /**
   * Get payments by user ID
   * @param userId User ID to filter payments
   * @returns Payment records for the specified user
   */
  async getPaymentsByUserId(userId: string) {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return payments;
    } catch (error) {
      throw new Error(
        `Error retrieving payments for user ${userId}: ${error.message}`,
      );
    }
  }

  /**
   * Get payments by user ID
   * @param restaurantId
   * @returns Payment records for the specified user
   */
  async getPaymentsByRestaurantId(restaurantId: string) {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          restaurantId: restaurantId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return payments;
    } catch (error) {
      throw new Error(
        `Error retrieving payments for restaurant ${restaurantId}: ${error.message}`,
      );
    }
  }
}
