import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  status?: DeliveryStatus;
  location?: {
    lat: number;
    lng: number;
  };
  pickedUpAt?: Date;
  deliveredAt?: Date;
}
