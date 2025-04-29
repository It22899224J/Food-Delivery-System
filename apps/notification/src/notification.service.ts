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
        html: text, // Changed from text to html
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Order Assignment</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #2c3e50;">Hello Driver,</h3>
            
            <p style="color: #34495e;">You have been assigned a new order:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p style="margin: 5px 0;"><strong>Pickup Location:</strong> ${orderDetails.restaurantAddress}</p>
              <p style="margin: 5px 0;"><strong>Delivery Location:</strong> ${orderDetails.customerAddress}</p>
              <p style="margin: 5px 0;"><strong>Customer Contact:</strong> ${orderDetails.customerContact}</p>
            </div>
            
            <p style="color: #34495e; margin-top: 20px;">Please confirm the order pickup through your driver app.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #7f8c8d; font-size: 14px;">Best regards,<br>Food Delivery Team</p>
            </div>
          </div>
        </div>
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

  async sendCustomerOrderConfirmation(
    customerEmail: string,
    orderDetails: any,
  ) {
    try {
      const subject = 'Order Confirmation';
      const text = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">Order Confirmation</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #2c3e50;">Hello ${orderDetails.customerName},</h3>
            
            <p style="color: #27ae60; font-size: 18px;">Your order has been confirmed! 🎉</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #27ae60; margin: 10px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p style="margin: 5px 0;"><strong>Restaurant:</strong> ${orderDetails.restaurantName}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
              <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDeliveryTime}</p>
            </div>
            
            <p style="color: #34495e; margin-top: 20px;">We'll notify you once your order is picked up by our driver.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #7f8c8d; font-size: 14px;">Thank you for choosing our service!<br>Food Delivery Team</p>
            </div>
          </div>
        </div>
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">Order Delivered! 🎉</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #2c3e50;">Hello ${orderDetails.customerName},</h3>
            
            <p style="color: #e74c3c; font-size: 18px;">Your order has been delivered!</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #e74c3c; margin: 10px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p style="margin: 5px 0;"><strong>Delivery Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #34495e; margin-top: 20px;">We hope you enjoy your meal. Please rate your experience in our app.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #7f8c8d; font-size: 14px;">Thank you for choosing our service!<br>Food Delivery Team</p>
            </div>
          </div>
        </div>
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

  async sendRestaurantOrderNotification(
    restaurantEmail: string,
    orderDetails: any,
  ) {
    try {
      const subject = 'New Order Received';
      const text = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #f39c12; padding-bottom: 10px;">New Order Received</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #2c3e50;">Hello ${orderDetails.restaurantName},</h3>
            
            <p style="color: #f39c12; font-size: 18px;">You have received a new order!</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #f39c12; margin: 10px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <h4 style="margin: 15px 0 10px;">Items:</h4>
              ${orderDetails.items.map(item => `
                <p style="margin: 5px 0 5px 15px;">• ${item.name} x${item.quantity}</p>
              `).join('')}
              <p style="margin: 15px 0 5px; font-weight: bold;">Total Amount: $${orderDetails.totalAmount}</p>
            </div>
            
            <p style="color: #34495e; margin-top: 20px;">Please confirm the order and estimated preparation time through your restaurant dashboard.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #7f8c8d; font-size: 14px;">Best regards,<br>Food Delivery Team</p>
            </div>
          </div>
        </div>
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
