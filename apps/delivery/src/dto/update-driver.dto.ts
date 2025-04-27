import { VehicleType } from '@prisma/client';

export class UpdateDriverDto {
  name?: string;
  contact?: string;
  location?: {
    lat: number;
    lng: number;
  };
  isAvailable?: boolean;
  vehicleType?: VehicleType;
  licensePlate?: string;
}