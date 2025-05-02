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
  @Get('owner/:ownerId')
  async findOneByOwner(@Param('ownerId') ownerId: string) {
    console.log(`Find Restaurant by Owner ID: ${ownerId}`);
    return this.restaurantService.findOneByOwner(ownerId);
  }
  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    console.log(`Find Restaurant by Name: ${name}`);
    return this.restaurantService.findByName(name);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    console.log(`Update Controller Restaurant by ID: ${id}`);
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`Delete Restaurant by ID: ${id}`);
    return this.restaurantService.remove(id);
  }
}
