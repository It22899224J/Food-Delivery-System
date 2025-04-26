import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        restaurantId: createOrderDto.restaurantId,
        items: JSON.parse(JSON.stringify(createOrderDto.items)), // Convert to plain object
        totalAmount,
        status: 'PENDING',
      },
    });
  }

  async findAllOrders() {
    return this.prisma.order.findMany();
  }

  async findOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
