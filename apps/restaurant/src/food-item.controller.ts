import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('food-items')
export class FoodItemController {
  constructor(private readonly foodItemService: FoodItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' is the name of the file field
  async create(
    @Body() createFoodItemDto: CreateFoodItemDto,
    @UploadedFile() image: Express.Multer.File, // Handle the uploaded image
  ) {
    return this.foodItemService.create(createFoodItemDto, image); // Pass the image to service
  }

  @Get()
  async findAll() {
    return this.foodItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.foodItemService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image')) // For updating with image upload support
  async update(
    @Param('id') id: number,
    @Body() updateFoodItemDto: UpdateFoodItemDto,
    @UploadedFile() image: Express.Multer.File, // Handle the uploaded image
  ) {
    return this.foodItemService.update(+id, updateFoodItemDto, image); // Pass the image to service
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.foodItemService.remove(+id);
  }
}
