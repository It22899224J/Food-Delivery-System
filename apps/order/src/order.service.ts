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
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject('DELIVERY_SERVICE') private deliveryClient: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
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

    //Emit event to delivery service
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
