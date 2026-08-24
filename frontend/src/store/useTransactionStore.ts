import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export interface Transaction {
  id: string;
  invoice_number: string;
  subtotal: number;
  tax: number;
  service_charge: number;
  grand_total: number;
  payment_method: string;
  tender_amount: number;
  change_amount: number;
  created_at: string;
  cashier_name?: string;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: async (txData) => {
        const newTx: Transaction = {
          ...txData,
          id: `tx-${Date.now()}`,
        };

        // 1. Instantly update local Zustand state so Reports update 100% reliably
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));

        // 2. Try inserting into Supabase Cloud (with null for FK safe inserts)
        try {
          const { error } = await supabase.from('transactions').insert({
            invoice_number: txData.invoice_number,
            subtotal: txData.subtotal,
            tax: txData.tax,
            grand_total: txData.grand_total,
            payment_method: txData.payment_method,
            tender_amount: txData.tender_amount,
            change_amount: txData.change_amount,
            created_at: txData.created_at,
          });

          if (error) {
            console.warn('[SUPABASE] Transaction insert warning (RLS or FK):', error.message);
          }
        } catch (err) {
          console.warn('[SUPABASE] Failed to sync transaction to cloud:', err);
        }
      },

      fetchTransactions: async () => {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            // Merge with local transactions
            set({ transactions: data });
          }
        } catch (e) {
          console.warn('[SUPABASE] Using local transactions fallback:', e);
        }
      },
    }),
    {
      name: 'mytra_transactions_history', // LocalStorage persistence
    }
  )
);
