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
    const imageBuffer = await this.processImage(image); // Process the image

    return this.prisma.foodItem.create({
      data: {
        ...createFoodItemDto,
        image: imageBuffer, // Store the binary image data
      },
    });
  }

  async update(
    id: number,
    updateFoodItemDto: UpdateFoodItemDto,
    image: Express.Multer.File | null,
  ) {
    const data: any = { ...updateFoodItemDto };

    if (image) {
      const imageBuffer = await this.processImage(image);
      data.image = imageBuffer; // Add or update image if provided
    }

    return this.prisma.foodItem.update({
      where: { id },
      data,
    });
  }

  async findAll() {
    return this.prisma.foodItem.findMany({
      include: {
        restaurant: true,
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

  async remove(id: number) {
    return this.prisma.foodItem.delete({
      where: { id },
    });
  }
}
