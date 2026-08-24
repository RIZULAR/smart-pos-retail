import { create } from 'zustand';
import { User, CashierShift } from '../types/pos';
import { supabase } from '../lib/supabaseClient';

interface AuthState {
  user: User | null;
  activeShift: CashierShift | null;
  login: (email: string, pin: string) => Promise<boolean>;
  logout: () => void;
  openShift: (startFloat: number) => Promise<void>;
  closeShift: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activeShift: null,

  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        console.error("Login error:", error);
        return false;
      }

      // In a real app, you would fetch the public.profiles here to get the full name and role.
      // For now, we set the auth user.
      set({ 
        user: { 
          id: data.user.id, 
          username: data.user.email?.split('@')[0] || 'kasir', 
          fullName: 'Kasir Utama', 
          role: 'CASHIER' 
        } 
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, activeShift: null });
  },

  openShift: async (startFloat) => {
    set((state) => {
      if (!state.user) return state;
      // In a real app, this inserts into public.shifts
      return {
        activeShift: {
          id: `shift-${Date.now()}`,
          userId: state.user.id,
          startFloat,
          status: 'OPEN',
          openedAt: new Date().toISOString()
        }
      };
    });
  },

  closeShift: async () => {
    // In a real app, this updates public.shifts
    set({ activeShift: null });
  }
}));
