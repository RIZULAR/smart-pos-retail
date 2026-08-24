import { create } from 'zustand';
import { CartItem, ProductVariant } from '../types/pos';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number; // 11% PPN
  grandTotal: number;
  addItem: (variant: ProductVariant) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + tax;
  return { subtotal, tax, grandTotal };
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  grandTotal: 0,
  
  addItem: (variant) => set((state) => {
    const existingItem = state.items.find(item => item.variant.id === variant.id);
    let newItems;
    
    if (existingItem) {
      newItems = state.items.map(item => 
        item.variant.id === variant.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * variant.price }
          : item
      );
    } else {
      newItems = [...state.items, { variant, quantity: 1, subtotal: variant.price }];
    }
    
    return { items: newItems, ...calculateTotals(newItems) };
  }),

  removeItem: (variantId) => set((state) => {
    const newItems = state.items.filter(item => item.variant.id !== variantId);
    return { items: newItems, ...calculateTotals(newItems) };
  }),

  updateQuantity: (variantId, quantity) => set((state) => {
    if (quantity <= 0) {
      const newItems = state.items.filter(item => item.variant.id !== variantId);
      return { items: newItems, ...calculateTotals(newItems) };
    }
    
    const newItems = state.items.map(item => 
      item.variant.id === variantId 
        ? { ...item, quantity, subtotal: quantity * item.variant.price }
        : item
    );
    
    return { items: newItems, ...calculateTotals(newItems) };
  }),

  clearCart: () => set({ items: [], subtotal: 0, tax: 0, grandTotal: 0 })
}));
