import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';

@Injectable()
export class FoodItemService {
  private prisma = new PrismaClient();

  async create(createFoodItemDto: CreateFoodItemDto) {
    return this.prisma.foodItem.create({
      data: createFoodItemDto,
    });
  }

  async findAll() {
    return this.prisma.foodItem.findMany({
      include: {
        restaurant: true, // also fetch restaurant info if you want
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.foodItem.findUnique({
      where: { id },
      include: {
        restaurant: true,
      },
    });
  }

  async update(id: number, updateFoodItemDto: UpdateFoodItemDto) {
    return this.prisma.foodItem.update({
      where: { id },
      data: updateFoodItemDto,
    });
  }

  async remove(id: number) {
    return this.prisma.foodItem.delete({
      where: { id },
    });
  }
}
