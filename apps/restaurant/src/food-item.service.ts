import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { Readable } from 'stream';

@Injectable()
export class FoodItemService {
  private prisma = new PrismaClient();

  // Helper function to convert the uploaded image file (Buffer)
  private async processImage(image: Express.Multer.File): Promise<Buffer> {
    // Assuming the image is a file object from multer or similar
    return image.buffer; // This returns the raw binary buffer of the image
  }

  async create(
    createFoodItemDto: CreateFoodItemDto,
    image: Express.Multer.File,
  ) {
    const imageBuffer = await this.processImage(image);

    return this.prisma.menuItem.create({
      data: {
        ...createFoodItemDto,
        image: imageBuffer,
      },
    });
  }

  async update(
    id: string,
    updateFoodItemDto: UpdateFoodItemDto,
    image: Express.Multer.File | null,
  ) {
    const data: any = { ...updateFoodItemDto };

    if (image) {
      const imageBuffer = await this.processImage(image);
      data.image = imageBuffer; // Add or update image if provided
    }

    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async findAll() {
    return this.prisma.menuItem.findMany({
      include: {
        restaurant: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        restaurant: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
