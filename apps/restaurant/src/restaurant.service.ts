import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client from generated client
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';


@Injectable()
export class RestaurantService {
  private prisma = new PrismaClient(); // Instantiate Prisma Client

  // Create a new restaurant
  async create(data: CreateRestaurantDto) {
    return this.prisma.restaurant.create({ data });
  }

  // Find all restaurants
  async findAll() {
    return this.prisma.restaurant.findMany();
  }

  // Find a specific restaurant by ID
  async findOne(id: number) {
    return this.prisma.restaurant.findUnique({ where: { id } });
  }

  // Update a restaurant by ID
  async update(id: number, data: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  // Delete a restaurant by ID
  async remove(id: number) {
    return this.prisma.restaurant.delete({ where: { id } });
  }
}
