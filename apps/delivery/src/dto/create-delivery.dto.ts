export class CreateDeliveryDto {
  orderId: string;
  driverId: string;
  location: {
    lat: number;
    lng: number;
  };
}
