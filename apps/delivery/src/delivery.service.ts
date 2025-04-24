import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  private prisma = new PrismaClient();

  async create(dto: CreateDeliveryDto) {
    return this.prisma.delivery.create({ data: dto });
  }

  async findAll() {
    return this.prisma.delivery.findMany();
  }

  async findOne(id: string) {
    return this.prisma.delivery.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateDeliveryDto) {
    return this.prisma.delivery.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.delivery.delete({ where: { id } });
  }
}