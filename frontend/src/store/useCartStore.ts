import { create } from 'zustand';
import { CartItem, ProductVariant } from '../types/pos';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number; // 11% PPN
  grandTotal: number;
  useTax: boolean; // Setting to toggle tax
  toggleTax: () => void;
  addItem: (variant: ProductVariant) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[], useTax: boolean) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = useTax ? Math.round(subtotal * 0.11) : 0;
  const grandTotal = subtotal + tax;
  return { subtotal, tax, grandTotal };
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  grandTotal: 0,
  useTax: true, // Default to true

  toggleTax: () => set((state) => ({
    useTax: !state.useTax,
    ...calculateTotals(state.items, !state.useTax)
  })),
  
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
    
    return { items: newItems, ...calculateTotals(newItems, state.useTax) };
  }),

  removeItem: (variantId) => set((state) => {
    const newItems = state.items.filter(item => item.variant.id !== variantId);
    return { items: newItems, ...calculateTotals(newItems, state.useTax) };
  }),

  updateQuantity: (variantId, quantity) => set((state) => {
    if (quantity <= 0) {
      const newItems = state.items.filter(item => item.variant.id !== variantId);
      return { items: newItems, ...calculateTotals(newItems, state.useTax) };
    }
    
    const newItems = state.items.map(item => 
      item.variant.id === variantId 
        ? { ...item, quantity, subtotal: quantity * item.variant.price }
        : item
    );
    
    return { items: newItems, ...calculateTotals(newItems, state.useTax) };
  }),

  clearCart: () => set({ items: [], subtotal: 0, tax: 0, grandTotal: 0 })
}));
