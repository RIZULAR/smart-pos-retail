import { ProductVariant } from '../types/pos';

export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Semua Menu' },
  { id: 'food', name: 'Makanan Utama' },
  { id: 'beverage', name: 'Minuman' },
  { id: 'snack', name: 'Cemilan' },
  { id: 'dessert', name: 'Dessert' },
];

export const MOCK_PRODUCTS: ProductVariant[] = [
  {
    id: 'prod-1',
    name: 'Nasi Goreng Spesial + Telur',
    sku: 'NASGOR-SPL',
    barcode: '8991234567890',
    price: 32000,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'prod-2',
    name: 'Es Teh Manis Jumbo',
    sku: 'ESTEH-JMB',
    barcode: '8990987654321',
    price: 8000,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'prod-3',
    name: 'Ayam Goreng Lengkuas + Nasi',
    sku: 'AYAM-LKG',
    barcode: '8991122334455',
    price: 35000,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=300&auto=format&fit=crop',
    isLowStock: true,
  },
  {
    id: 'prod-4',
    name: 'Kopi Susu Gula Aren',
    sku: 'KOPI-AREN',
    barcode: '8995544332211',
    price: 22000,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'prod-5',
    name: 'Kentang Goreng (French Fries)',
    sku: 'FRIES-REG',
    barcode: '8996677889900',
    price: 18000,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'prod-6',
    name: 'Double Cheese Beef Burger',
    sku: 'BRG-DBL-CHS',
    barcode: '8997788990011',
    price: 45000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'prod-7',
    name: 'Roti Bakar Coklat Keju',
    sku: 'ROTI-CKL-KJU',
    barcode: '8998899001122',
    price: 20000,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'prod-8',
    name: 'Iced Matcha Latte',
    sku: 'MATCHA-ICE',
    barcode: '8999900112233',
    price: 26000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=300&auto=format&fit=crop',
    isLowStock: false,
  }
];
