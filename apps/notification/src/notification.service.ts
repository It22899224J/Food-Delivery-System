import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private async sendEmail(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to send email notification',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendDriverOrderNotification(driverEmail: string, orderDetails: any) {
    try {
      const subject = 'New Order Assignment';
      const text = `
        Hello Driver,

        You have been assigned a new order:
        Order ID: ${orderDetails.orderId}
        Pickup Location: ${orderDetails.restaurantAddress}
        Delivery Location: ${orderDetails.customerAddress}
        Customer Contact: ${orderDetails.customerContact}

        Please confirm the order pickup through your driver app.

        Best regards,
        Food Delivery Team
    `;
      return await this.sendEmail(driverEmail, subject, text);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to send driver notification',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendCustomerOrderConfirmation(customerEmail: string, orderDetails: any) {
    try {
      const subject = 'Order Confirmation';
      const text = `
        Hello ${orderDetails.customerName},

        Your order has been confirmed!
        Order ID: ${orderDetails.orderId}
        Restaurant: ${orderDetails.restaurantName}
        Total Amount: $${orderDetails.totalAmount}
        Estimated Delivery Time: ${orderDetails.estimatedDeliveryTime}

        We'll notify you once your order is picked up by our driver.

        Thank you for choosing our service!
        Food Delivery Team
    `;
      return await this.sendEmail(customerEmail, subject, text);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to send customer confirmation',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendCustomerDeliveryComplete(customerEmail: string, orderDetails: any) {
    try {
      const subject = 'Order Delivered';
      const text = `
        Hello ${orderDetails.customerName},

        Your order has been delivered!
        Order ID: ${orderDetails.orderId}
        Delivery Time: ${new Date().toLocaleString()}

        We hope you enjoy your meal. Please rate your experience in our app.

        Thank you for choosing our service!
        Food Delivery Team
    `;
      return await this.sendEmail(customerEmail, subject, text);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to send delivery completion notification',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendRestaurantOrderNotification(restaurantEmail: string, orderDetails: any) {
    try {
      const subject = 'New Order Received';
      const text = `
        Hello ${orderDetails.restaurantName},

        You have received a new order:
        Order ID: ${orderDetails.orderId}
        Items:
        ${orderDetails.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

        Total Amount: $${orderDetails.totalAmount}

        Please confirm the order and estimated preparation time through your restaurant dashboard.

        Best regards,
        Food Delivery Team
    `;
      return await this.sendEmail(restaurantEmail, subject, text);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to send restaurant notification',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
