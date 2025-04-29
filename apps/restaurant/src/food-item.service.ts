import { Injectable } from '@nestjs/common';
import { MenuItem, PrismaClient } from '@prisma/client';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FoodItemService {
  private prisma = new PrismaClient();



  // Method to create a food item, accepting the DTO and image URL
  async create(dto: CreateFoodItemDto, imageUrl: string): Promise<any> {
    const { name, description, price, categoryId, available, popular, allergies, dietary, restaurantId } = dto;

    // Create a new menu item in the database using Prisma
    const newItem = await this.prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        image: imageUrl, // Store the image URL returned by Cloudinary
        categoryId,
        available,
        popular,
        allergies,
        dietary,
        restaurantId,
      },
    });

    return newItem; // Return the created menu item
  }
  async update(id: string, dto: UpdateFoodItemDto, image: Express.Multer.File | null | undefined) {
    const data: any = { ...dto };

    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async findAll() {
    return this.prisma.menuItem.findMany({
      include: { restaurant: true },
    });
  }

async findAllByRestaurant(restaurantId: string): Promise<MenuItem[]> {
  return this.prisma.menuItem.findMany({
    where: { restaurantId },
  });
}

  async findOne(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: { restaurant: true },
    });
  }

  async remove(id: string) {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
