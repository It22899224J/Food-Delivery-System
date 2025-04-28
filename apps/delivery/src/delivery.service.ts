import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, DeliveryStatus, VehicleType } from '@prisma/client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverAvailabilityDto } from './dto/update-driver-availability.dto';
import { UpdateDriverLocationDto } from './dto/update-drivery-location.dto';

@Injectable()
export class DeliveryService {
  private prisma = new PrismaClient();

  // Delivery methods
  async createDelivery(createDto: CreateDeliveryDto) {
    const availableDriver = await this.findAvailableDriver(createDto.startLocation);
    if (!availableDriver) {
      throw new NotFoundException('No available drivers found');
    }

    return this.prisma.delivery.create({
      data: {
        orderId: createDto.orderId,
        driverId: availableDriver.id,
        startLocation: createDto.startLocation,
        endLocation: createDto.endLocation,
        status: 'ASSIGNED',
        assignedAt: new Date(),
        estimatedTime: createDto.estimatedTime,
      },
    });
  }

  async updateDelivery(id: string, updateDto: UpdateDeliveryDto) {
    const existingDelivery = await this.prisma.delivery.findUnique({ where: { id } });
    if (!existingDelivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    const updateData: any = {
      status: updateDto.status,
      ...(updateDto.currentLocation && { currentLocation: updateDto.currentLocation }),
      ...(updateDto.estimatedTime && { estimatedTime: updateDto.estimatedTime }),
    };

    if (updateDto.status === 'PICKED_UP') {
      updateData.pickedUpAt = new Date();
    } else if (updateDto.status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    } 

    return this.prisma.delivery.update({
      where: { id },
      data: updateData,
    });
  }

  async findAllDeliveries() {
    return this.prisma.delivery.findMany({
      include: { driver: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findDeliveryById(id: string) {
    const delivery = await this.prisma.delivery.findUnique({ 
      where: { id },
      include: { driver: true },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }

  // Driver methods
  async createDriver(createDto: CreateDriverDto) {
    return this.prisma.driver.create({
      data: {
        name: createDto.name,
        email: createDto.email,
        contact: createDto.contact,
        vehicleType: createDto.vehicleType,
        licensePlate: createDto.licensePlate,
        location: createDto.location,
        isAvailable: true,
      },
    });
  }

  async updateDriver(id: string, updateDto: UpdateDriverDto) {
    return this.prisma.driver.update({
      where: { id },
      data: updateDto,
    });
  }

  async updateDriverAvailability(id: string, updateDto: UpdateDriverAvailabilityDto) {
    return this.prisma.driver.update({
      where: { id },
      data: { isAvailable: updateDto.isAvailable },
    });
  }

  async updateDriverLocation(id: string, updateDto: UpdateDriverLocationDto) {
    // find the driver's active delivery
    const activeDelivery = await this.prisma.delivery.findFirst({
      where: {
        driverId: id,
        status: {
          in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT']
        }
      }
    });

    // Update driver's location
    await this.prisma.driver.update({
      where: { id },
      data: { location: { lat: updateDto.latitude, lng: updateDto.longitude } },
    });

    // If there's an active delivery, update its current location too
    if (activeDelivery) {
      await this.prisma.delivery.update({
        where: { id: activeDelivery.id },
        data: { currentLocation: { lat: updateDto.latitude, lng: updateDto.longitude } },
      });
    }

    return { 
      message: 'Driver location updated successfully',
      driverId: id,
      location: { lat: updateDto.latitude, lng: updateDto.longitude }
    };
}

  async findAllDrivers() {
    return this.prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findDriverById(id: string) {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async findAvailableDrivers() {
    return this.prisma.driver.findMany({
      where: { isAvailable: true },
    });
  }

  private async findAvailableDriver(location: { lat: number; lng: number }) {
    const availableDrivers = await this.prisma.driver.findMany({
      where: { isAvailable: true },
    });

    if (availableDrivers.length === 0) return null;

    // Simple distance calculation (in production, use proper geospatial queries)
    const driversWithDistance = availableDrivers.map(driver => {
      const driverLoc = driver.location as { lat: number; lng: number };
      const distance = this.calculateDistance(
        location.lat,
        location.lng,
        driverLoc?.lat || 0,
        driverLoc?.lng || 0,
      );
      return { ...driver, distance };
    });

    return driversWithDistance.sort((a, b) => a.distance - b.distance)[0];
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}