import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductVariant, CartItem } from '../types/pos';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface ProductStore {
  products: ProductVariant[];
  deductStock: (cartItems: CartItem[]) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,

      deductStock: (cartItems: CartItem[]) => {
        set((state) => {
          const updatedProducts = state.products.map((prod) => {
            const cartItem = cartItems.find((ci) => ci.variant.id === prod.id);
            if (cartItem) {
              const newStock = Math.max(0, prod.stock - cartItem.quantity);
              return {
                ...prod,
                stock: newStock,
                isLowStock: newStock <= 5,
              };
            }
            return prod;
          });

          return { products: updatedProducts };
        });
      },
    }),
    {
      name: 'mytra_product_inventory', // local storage key for stock
    }
  )
);
