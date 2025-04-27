import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { FoodItemController } from './food-item.controller';
import { FoodItemService } from './food-item.service';

@Module({
  imports: [],
  controllers: [RestaurantController, FoodItemController],
  providers: [RestaurantService, FoodItemService],
})
export class RestaurantModule {}
