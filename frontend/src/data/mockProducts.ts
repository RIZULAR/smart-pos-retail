import { ProductVariant } from '../types/pos';

export const MOCK_PRODUCTS: ProductVariant[] = [
  {
    id: 'var-1',
    name: 'Classic Cotton T-Shirt - White / XL',
    sku: 'TSH-WHT-XL',
    barcode: '8991234567890',
    price: 125000,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=250&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'var-2',
    name: 'Nike Air Force 1 - Red/Black / 42',
    sku: 'NK-AF1-RB-42',
    barcode: '8990987654321',
    price: 1450000,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=250&auto=format&fit=crop',
    isLowStock: false,
  },
  {
    id: 'var-3',
    name: 'Denim Jacket Vintage Blue / M',
    sku: 'JCK-BLU-M',
    barcode: '8991122334455',
    price: 450000,
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=250&auto=format&fit=crop',
    isLowStock: true,
  },
  {
    id: 'var-4',
    name: 'Minimalist Smart Watch',
    sku: 'WTC-SMART-01',
    barcode: '8995544332211',
    price: 899000,
    stock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=250&auto=format&fit=crop',
    isLowStock: false,
  }
];
