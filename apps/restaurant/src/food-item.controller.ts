import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';

@Controller('food-items')
export class FoodItemController {
  constructor(private readonly foodItemService: FoodItemService) {}

  @Post()
  async create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemService.create(createFoodItemDto);
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
  async update(
    @Param('id') id: number,
    @Body() updateFoodItemDto: UpdateFoodItemDto,
  ) {
    return this.foodItemService.update(+id, updateFoodItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.foodItemService.remove(+id);
  }
}
