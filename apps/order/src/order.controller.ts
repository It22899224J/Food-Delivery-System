import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async findAllOrders() {
    return this.orderService.findAllOrders();
  }

  @Get(':id')
  async findOrderById(@Param('id') id: string) {
    return this.orderService.findOrderById(id);
  }

  @Get('user/:userId')
  async findOrdersByUser(@Param('userId') userId: string) {
    return this.orderService.findOrdersByUser(userId);
  }

  @Get('restaurant/:restaurantId')
  async findOrdersByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.orderService.findOrdersByRestaurant(restaurantId);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateStatusDto);
  }

  @Patch(':id/payment')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto,
  ) {
    return this.orderService.updatePaymentStatus(id, updatePaymentDto);
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body('cancelledBy') cancelledBy: string,
  ) {
    return this.orderService.cancelOrder(id, cancelledBy);
  }
}
