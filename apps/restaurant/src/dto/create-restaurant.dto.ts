export class CreateRestaurantDto {
  name: string;
  description: string;
  address: string;
  position: { lat: number; lng: number }; // Position as latitude and longitude
  phone: string;
  email: string;
  logo: string;
  banner: string;
  cuisineType: string[]; // Array of cuisine types
  rating: number;
  isActive: boolean;
}
