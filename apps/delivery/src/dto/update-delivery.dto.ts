import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  status?: DeliveryStatus;
  location?: string;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}
