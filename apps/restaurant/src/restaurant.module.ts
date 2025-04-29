import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { FoodItemController } from './food-item.controller';
import { FoodItemService } from './food-item.service';
import * as multer from 'multer'; // Correct import for multer
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // Enables .buffer on uploaded files
      limits: { fileSize: 5 * 1024 * 1024 }, // Optional size limit (5MB)
    }),
  ],
  controllers: [RestaurantController, FoodItemController],
  providers: [RestaurantService, FoodItemService,ImageUploadService],
})
export class RestaurantModule {}