import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductVariant, CartItem } from '../types/pos';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface ProductStore {
  products: ProductVariant[];
  deductStock: (cartItems: CartItem[]) => void;
  addProduct: (product: Omit<ProductVariant, 'id' | 'isLowStock'>) => void;
  updateProduct: (id: string, product: Partial<ProductVariant>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,

      addProduct: (prod) => set((state) => {
        const newProduct: ProductVariant = {
          ...prod,
          id: `prod-${Date.now()}`,
          isLowStock: prod.stock <= 10,
        };
        return { products: [newProduct, ...state.products] };
      }),

      updateProduct: (id, updatedProd) => set((state) => ({
        products: state.products.map((p) => 
          p.id === id ? { ...p, ...updatedProd, isLowStock: (updatedProd.stock ?? p.stock) <= 10 } : p
        )
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),

      deductStock: (cartItems: CartItem[]) => {
        set((state) => {
          const updatedProducts = state.products.map((prod) => {
            const cartItem = cartItems.find((ci) => ci.variant.id === prod.id);
            if (cartItem) {
              const newStock = Math.max(0, prod.stock - cartItem.quantity);
              return {
                ...prod,
                stock: newStock,
                isLowStock: newStock <= 10,
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
