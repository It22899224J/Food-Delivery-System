import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  Query,
} from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';

@Controller('food-items')
export class FoodItemController {
  constructor(
    private readonly foodItemService: FoodItemService,
    private readonly imageUploadService: ImageUploadService, // Inject Image Upload Service
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: any
  ) {
    if (!body) {
      throw new Error('Request body is null or undefined');
    }
  
    // Parse text fields from FormData
    const dto = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      categoryId: body.categoryId,
      available: body.available === 'true',
      popular: body.popular === 'true',
      restaurantId: body.restaurantId,
      allergies: this.parseFormDataArray(body.allergies),
      dietary: this.parseFormDataArray(body.dietary),
    };
  
    let imageUrl = '';
    if (image) {
      imageUrl = await this.imageUploadService.uploadImage(image.buffer.toString('base64'));
    } else if (body.image) {
      // Fallback for base64 string sent as text field
      imageUrl = await this.imageUploadService.uploadImage(body.image);
    }
  
    return this.foodItemService.create(dto, imageUrl.toString());
  }
  
  private parseFormDataArray(value: any): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (value && typeof value === 'string') {
      try {
        // Try parsing as JSON if sent as stringified array
        return JSON.parse(value);
      } catch {
        // If not JSON, treat as single value array
        return [value];
      }
    }
    return [];
  }
  
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFoodItemDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.foodItemService.update(id, dto, image || null);
  }

  @Get()
  async findAll(@Query('restaurantId') restaurantId?: string) {
    if (restaurantId) {
      return this.foodItemService.findAllByRestaurant(restaurantId);
    }
    return this.foodItemService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.foodItemService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.foodItemService.remove(id);
  }
}
