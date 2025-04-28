export interface Restaurant {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
}