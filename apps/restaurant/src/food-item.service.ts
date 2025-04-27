import { Injectable } from '@nestjs/common';
import { MenuItem, PrismaClient } from '@prisma/client';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
@Injectable()
export class FoodItemService {
  private prisma = new PrismaClient();

  async create(dto: CreateFoodItemDto, imageUrl: string): Promise<any> {
    const {
      name,
      description,
      price,
      categoryId,
      available,
      popular,
      allergies,
      dietary,
      restaurantId,
    } = dto;

    // Use a transaction to ensure consistency
    const newItem = await this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        throw new Error(`Restaurant with ID ${restaurantId} does not exist`);
      }
      return tx.menuItem.create({
        data: {
          name,
          description,
          price,
          categoryId,
          available,
          popular,
          allergies,
          dietary,
          restaurantId,
          image: imageUrl,
        },
      });
    });

    return newItem; 
  }
async update(
  id: string,
  dto: UpdateFoodItemDto,
  imageUrl?: string,
): Promise<MenuItem> {
  const {
    name,
    description,
    price,
    categoryId,
    available,
    popular,
    allergies,
    dietary,
    restaurantId,
  } = dto;
  const updatedItem = await this.prisma.$transaction(async (tx) => {
    if (restaurantId) {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        throw new Error(`Restaurant with ID ${restaurantId} does not exist`);
      }
    }

    const data: any = {
      name,
      description,
      price,
      categoryId,
      available,
      popular,
      allergies,
      dietary,
      restaurantId,
    };
    if (imageUrl) {
      data.image = imageUrl;
    }
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    return tx.menuItem.update({
      where: { id },
      data,
    });
  });

  return updatedItem;
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
