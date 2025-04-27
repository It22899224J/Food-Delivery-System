import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // Delivery endpoints
  @Post('deliveries')
  createDelivery(@Body() createDto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery(createDto);
  }

  @Get('deliveries')
  findAllDeliveries() {
    return this.deliveryService.findAllDeliveries();
  }

  @Get('deliveries/:id')
  findDeliveryById(@Param('id') id: string) {
    return this.deliveryService.findDeliveryById(id);
  }

  @Patch('deliveries/:id')
  updateDelivery(@Param('id') id: string, @Body() updateDto: UpdateDeliveryDto) {
    return this.deliveryService.updateDelivery(id, updateDto);
  }

  // Driver endpoints
  @Post('drivers')
  createDriver(@Body() createDto: CreateDriverDto) {
    return this.deliveryService.createDriver(createDto);
  }

  @Get('drivers')
  findAllDrivers(@Query('available') available?: boolean) {
    if (available === true) {
      return this.deliveryService.findAvailableDrivers();
    }
    return this.deliveryService.findAllDrivers();
  }

  @Get('drivers/:id')
  findDriverById(@Param('id') id: string) {
    return this.deliveryService.findDriverById(id);
  }

  @Patch('drivers/:id')
  updateDriver(@Param('id') id: string, @Body() updateDto: UpdateDriverDto) {
    return this.deliveryService.updateDriver(id, updateDto);
  }
}