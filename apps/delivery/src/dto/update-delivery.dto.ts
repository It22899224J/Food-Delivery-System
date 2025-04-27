import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  status?: DeliveryStatus;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  estimatedTime?: number;
}