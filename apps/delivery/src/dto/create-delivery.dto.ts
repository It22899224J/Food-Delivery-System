export class CreateDeliveryDto {
  orderId: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
  estimatedTime?: number;
}