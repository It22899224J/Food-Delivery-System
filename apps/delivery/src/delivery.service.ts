import { Injectable } from '@nestjs/common';
import { PrismaClient, DeliveryStatus } from '@prisma/client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  private prisma = new PrismaClient();

  async create(createDto: CreateDeliveryDto) {
    return this.prisma.delivery.create({
      data: {
        ...createDto,
        status: DeliveryStatus.PENDING,
        assignedAt: new Date(),
      },
    });
  }

  async update(id: string, updateDto: UpdateDeliveryDto) {
    return this.prisma.delivery.update({
      where: { id },
      data: updateDto,
    });
  }

  async findAll() {
    return this.prisma.delivery.findMany();
  }

  async findOne(id: string) {
    return this.prisma.delivery.findUnique({ where: { id } });
  }
}
