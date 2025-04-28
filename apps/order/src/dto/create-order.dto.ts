import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

class OrderItemDto {
  @IsString()
  itemId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  specialInstructions?: string;
}

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsString()
  restaurantId: string;

  @IsString()
  deliveryAddress: string;

  @IsString()
  @IsOptional()
  deliveryInstructions?: string;

  @IsArray()
  items: OrderItemDto[];

  paymentStatus: string;

  paymentMethod: string;

  deliveryFee?: number;
}
