import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderStatusDto,
  OrderStatus,
} from './dto/update-order-status.dto';
import {
  UpdatePaymentStatusDto,
  PaymentStatus,
} from './dto/update-payment-status.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject('DELIVERY_SERVICE') private deliveryClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  private API_URL_AUTH = "http://auth-service:3012";
  private API_URL_NOTIFICATION = "http://notification-service:3015";
  private API_URL_RESTAURANT = "http://restaurant:3000";

  async createOrder(createOrderDto: CreateOrderDto) {
    console.log('Order creation initiated', {
      userId: createOrderDto.userId,
      source: createOrderDto,
      items: createOrderDto.items.map((i) => i.itemId),
      timestamp: new Date().toISOString(),
    });
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Add delivery fee to total amount
    const deliveryFee = createOrderDto.deliveryFee || 0;
    const finalAmount = totalAmount + deliveryFee;

    const order = await this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        restaurantId: createOrderDto.restaurantId,
        deliveryAddress: createOrderDto.deliveryAddress,
        deliveryInstructions: createOrderDto.deliveryInstructions,
        totalAmount: finalAmount,
        paymentStatus:
          (createOrderDto.paymentStatus as PaymentStatus) ||
          PaymentStatus.PENDING,
        paymentMethod: createOrderDto.paymentMethod,
        items: {
          create: createOrderDto.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
            specialInstructions: item.specialInstructions,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Emit event to delivery service
    try {
      const payload = {
        orderId: order.id,
        restaurantId: order.restaurantId,
        deliveryAddress: {
          lat: parseFloat(order.deliveryAddress.split(',')[0]),
          lng: parseFloat(order.deliveryAddress.split(',')[1]),
        },
      };
      console.log('Emitting order:created event with payload:', payload);
      this.deliveryClient.emit('order:created', payload);
    } catch (error) {
      console.error('Error emitting order:created event:', error);
    }

    try {
      const auth_url = `${this.API_URL_AUTH}/auth/users/${order.userId}`;
      const restaurant_url = `${this.API_URL_RESTAURANT}/restaurants/${order.restaurantId}`;
      const auth_response = await firstValueFrom(
        this.httpService.get(auth_url),
      );
      if (auth_response.status !== 200) {
        throw new Error('Failed to get user information for email');
      }

      const restaurant_response = await firstValueFrom(
        this.httpService.get(restaurant_url),
      );
      if (restaurant_response.status!== 200) {
        throw new Error('Failed to get restaurant information for email');
      }

      const user = auth_response.data.user;

      const notification_url = `${this.API_URL_NOTIFICATION}/notification/customer/confirmation`;
      const notification_response = firstValueFrom(this.httpService.post(notification_url, {
          "email": user.email,
          "orderDetails": {
            "customerName": user.name,
            "orderId": order.id,
            "restaurantName": restaurant_response.data.name,
            "totalAmount": order.totalAmount
          },
      }),
     );
    } catch (error) {
      console.error('Error emitting order:created event:', error);
    }

    // Save payment information after successful order creation
    try {
      const paymentPayload = {
        transactionId: `order_${order.id}`,
        orderId: order.id,
        userId: order.userId,
        amount: order.totalAmount,
        restaurantId: order.restaurantId,
        paymentMethod: order.paymentMethod,
      };
      console.log('Saving payment information:', paymentPayload);
      this.paymentClient.send('payment:save', paymentPayload).subscribe(
        (response) => console.log('Payment saved successfully:', response),
        (error) => console.error('Error saving payment:', error),
      );
    } catch (error) {
      console.error('Error processing payment:', error);
    }

    return order;
  }

  async findAllOrders() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async findOrdersByRestaurant(restaurantId: string) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async updateOrderStatus(id: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOrderById(id);

    // Validate status transition

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        statusHistory: {
          create: {
            previousStatus: order.status,
            newStatus: updateStatusDto.status,
            changedBy: updateStatusDto.changedBy,
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async updatePaymentStatus(
    id: string,
    updatePaymentDto: UpdatePaymentStatusDto,
  ) {
    await this.findOrderById(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus: updatePaymentDto.status,
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  async cancelOrder(id: string, cancelledBy: string) {
    const order = await this.findOrderById(id);

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel a delivered order');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        statusHistory: {
          create: {
            previousStatus: order.status,
            newStatus: OrderStatus.CANCELLED,
            changedBy: cancelledBy,
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });
  }

  // private isValidStatusTransition(
  //   currentStatus: OrderStatus,
  //   newStatus: OrderStatus,
  // ): boolean {
  //   const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  //     [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  //     [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  //     [OrderStatus.PREPARING]: [
  //       OrderStatus.READY_FOR_PICKUP,
  //       OrderStatus.CANCELLED,
  //     ],
  //     [OrderStatus.READY_FOR_PICKUP]: [
  //       OrderStatus.ON_THE_WAY,
  //       OrderStatus.CANCELLED,
  //     ],
  //     [OrderStatus.ON_THE_WAY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  //     [OrderStatus.DELIVERED]: [],
  //     [OrderStatus.CANCELLED]: [],
  //   };

  //   return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  // }
}
