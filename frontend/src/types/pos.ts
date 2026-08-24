export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock: number;
  imageUrl: string;
  isLowStock: boolean;
}

export interface CartItem {
  variant: ProductVariant;
  quantity: number;
  subtotal: number;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'CASHIER' | 'SUPERVISOR';
}

export interface CashierShift {
  id: string;
  userId: string;
  startFloat: number;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
}

