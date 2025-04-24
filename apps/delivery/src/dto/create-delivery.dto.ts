export class CreateDeliveryDto {
    orderId: string;
    driverId: string;
    status?: string;  // Optional (defaults to 'PENDING' in schema)
  }