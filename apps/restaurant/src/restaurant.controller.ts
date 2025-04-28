import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    console.log('Create Restaurant endpoint hit');
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  async findAll() {
    console.log('Find All Restaurants endpoint hit');
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`Find Restaurant by ID: ${id}`);
    return this.restaurantService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    console.log(`Update Restaurant by ID: ${id}`);
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`Delete Restaurant by ID: ${id}`);
    return this.restaurantService.remove(id);
  }
}
