import { create } from 'zustand';
import { CartItem, ProductVariant } from '../types/pos';

interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number; // 11% PPN
  serviceCharge: number; // 5% Service Charge
  grandTotal: number;
  useTax: boolean; 
  useServiceCharge: boolean;
  toggleTax: () => void;
  toggleServiceCharge: () => void;
  addItem: (variant: ProductVariant) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[], useTax: boolean, useServiceCharge: boolean) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = useTax ? Math.round(subtotal * 0.11) : 0;
  const serviceCharge = useServiceCharge ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + tax + serviceCharge;
  return { subtotal, tax, serviceCharge, grandTotal };
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  serviceCharge: 0,
  grandTotal: 0,
  useTax: true, 
  useServiceCharge: false, 

  toggleTax: () => set((state) => ({
    useTax: !state.useTax,
    ...calculateTotals(state.items, !state.useTax, state.useServiceCharge)
  })),

  toggleServiceCharge: () => set((state) => ({
    useServiceCharge: !state.useServiceCharge,
    ...calculateTotals(state.items, state.useTax, !state.useServiceCharge)
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
    
    return { items: newItems, ...calculateTotals(newItems, state.useTax, state.useServiceCharge) };
  }),

  removeItem: (variantId) => set((state) => {
    const newItems = state.items.filter(item => item.variant.id !== variantId);
    return { items: newItems, ...calculateTotals(newItems, state.useTax, state.useServiceCharge) };
  }),

  updateQuantity: (variantId, quantity) => set((state) => {
    if (quantity <= 0) {
      const newItems = state.items.filter(item => item.variant.id !== variantId);
      return { items: newItems, ...calculateTotals(newItems, state.useTax, state.useServiceCharge) };
    }
    
    const newItems = state.items.map(item => 
      item.variant.id === variantId 
        ? { ...item, quantity, subtotal: quantity * item.variant.price }
        : item
    );
    
    return { items: newItems, ...calculateTotals(newItems, state.useTax, state.useServiceCharge) };
  }),

  clearCart: () => set({ items: [], subtotal: 0, tax: 0, serviceCharge: 0, grandTotal: 0 })
}));
