import { VehicleType } from '@prisma/client';

export class CreateDriverDto {
  name: string;
  email: string;
  contact: string;
  vehicleType: VehicleType;
  licensePlate: string;
  location?: {
    lat: number;
    lng: number;
  };
}