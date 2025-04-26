import { IsString, IsArray, IsNumber } from 'class-validator';

class OrderItemDto {
  @IsString()
  itemId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsString()
  restaurantId: string;

  @IsArray()
  items: OrderItemDto[];
}
