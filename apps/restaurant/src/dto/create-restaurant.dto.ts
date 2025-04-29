export class CreateRestaurantDto {
  name: string;
  description: string;
  address: string;
  position: { lat: number; lng: number }; 
  phone: string;
  email: string;
  logo?: string;
  cuisineType: string[]; 
  rating?: number;
  isActive: boolean;
  ownerId:  string; 
}
