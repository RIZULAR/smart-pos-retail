import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

          const isAdmin = email.toLowerCase().includes('admin');

          set({ 
            user: { 
              id: data.user.id, 
              username: data.user.email?.split('@')[0] || 'kasir', 
              fullName: isAdmin ? 'Administrator' : 'Kasir Utama', 
              role: isAdmin ? 'ADMIN' : 'CASHIER' 
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
        set({ activeShift: null });
      }
    }),
    {
      name: 'mytra_auth_session', // local storage key
    }
  )
);
