import { Order, OrderItem, Product } from '@prisma/client';

export interface ApiOrderItem extends OrderItem {
  product?: Product;
}

export interface ApiOrder extends Order {
  orderItems: ApiOrderItem[];
}

export type UiOrderItem = {
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  sku?: string;
  description?: string;
  category?: string;
};

export type UiOrder = {
  orderNumber: string;
  status: string;
  totalPrice: number;
  orderDay: string;
  orderItems: UiOrderItem[];
};
