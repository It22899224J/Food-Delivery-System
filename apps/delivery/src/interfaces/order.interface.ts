export interface OrderItem {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  deliveryPersonnelId?: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}