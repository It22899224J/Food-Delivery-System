import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, DeliveryStatus } from '@prisma/client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  private prisma = new PrismaClient();

  async create(createDto: CreateDeliveryDto) {
    return this.prisma.delivery.create({
      data: {
        orderId: createDto.orderId,
        driverId: createDto.driverId,
        location: JSON.stringify(createDto.location),
        status: DeliveryStatus.PENDING,
        assignedAt: new Date(),
      },
    });
  }

  async update(id: string, updateDto: UpdateDeliveryDto) {
    const existingDelivery = await this.prisma.delivery.findUnique({
      where: { id },
    });

    if (!existingDelivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    const updateData: any = {
      status: updateDto.status,
      ...(updateDto.location && { location: updateDto.location }),
    };

    if (updateDto.status === DeliveryStatus.PICKED_UP) {
      updateData.pickedUpAt = new Date();
    } else if (updateDto.status === DeliveryStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    return this.prisma.delivery.update({
      where: { id },
      data: updateData,
    });
  }

  async findAll() {
    return this.prisma.delivery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const delivery = await this.prisma.delivery.findUnique({ 
      where: { id },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }
}