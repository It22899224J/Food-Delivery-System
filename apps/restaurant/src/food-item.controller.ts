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
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createFoodItemDto: CreateFoodItemDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.foodItemService.create(createFoodItemDto, image);
  }

  @Get()
  async findAll() {
    return this.foodItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.foodItemService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateFoodItemDto: UpdateFoodItemDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.foodItemService.update(id, updateFoodItemDto, image);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.foodItemService.remove(id);
  }
}
