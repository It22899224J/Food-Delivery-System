import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client from generated client
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class RestaurantService {
  private prisma = new PrismaClient(); // Instantiate Prisma Client
  constructor(private readonly httpService: HttpService) {}


  // You can move this outside the class if it's a constant for the file
  private API_URL_ORDER = "http://order-service:3004";

  // Create a new restaurant
  async create(data: CreateRestaurantDto) {
    return this.prisma.restaurant.create({ data });
  }

  // Find all restaurants
  async findAll() {
    return this.prisma.restaurant.findMany();
  }

  // Find a specific restaurant by ID
  async findOne(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true,
      },
    });
  }

  //Find by owner
async findOneByOwner(ownerId: string) {
  return this.prisma.restaurant.findFirst({
    where: { ownerId },
    include: {
      menuItems: true,
    },
  });
}
  // Find a restaurant by name
  async findByName(name: string) {
    return this.prisma.restaurant.findFirst({
      where: { name },
      include: {
        menuItems: true,
      },
    });
  }

  // Update a restaurant by ID
  async update(id: string, data: UpdateRestaurantDto) {
    console.log('Update Restaurant Service', id, data);
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  // Delete a restaurant by ID
  async remove(id: string) {
    return this.prisma.restaurant.delete({ where: { id } });
  }

  async getOrdersByRestaurantId(restaurantId: string) {
    const url = `${this.API_URL_ORDER}/restaurant/${restaurantId}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async updateOrderStatus(orderId: string, updateDto: any) {
    const url = `${this.API_URL_ORDER}/${orderId}/status`;
    const response = await firstValueFrom(this.httpService.patch(url, updateDto));
    return response.data;
  }
  
}
