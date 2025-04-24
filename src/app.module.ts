import { Module } from '@nestjs/common';

import { PrismaClient } from '@prisma/client'; 
import { RestaurantController } from 'apps/restaurant/src/restaurant.controller';
import { RestaurantService } from 'apps/restaurant/src/restaurant.service';

@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: PrismaClient, 
      useValue: new PrismaClient(), 
    },
  ],
})
export class AppModule {}
