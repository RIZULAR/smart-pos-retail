import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { CartItem } from '../types/pos';
import { supabase } from '../lib/supabaseClient';

const queueStorage = localforage.createInstance({ name: 'mytra_pos_offline_queue' });

export interface QueuedOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  tenderAmount: number;
  change: number;
  paymentMethod: string;
  shiftId: string;
  cashierId: string;
  createdAt: string;
}

export function useOfflineQueue() {
  const [queueCount, setQueueCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshQueueCount = async () => {
    const pendingQueue: QueuedOrder[] = (await queueStorage.getItem('pending_orders')) || [];
    setQueueCount(pendingQueue.length);
  };

  useEffect(() => {
    refreshQueueCount();
    
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue(); // Auto sync when coming back online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const enqueueOrder = async (orderPayload: QueuedOrder) => {
    const pendingQueue: QueuedOrder[] = (await queueStorage.getItem('pending_orders')) || [];
    pendingQueue.push(orderPayload);
    await queueStorage.setItem('pending_orders', pendingQueue);
    await refreshQueueCount();
    
    // Attempt auto-sync immediately in background
    if (navigator.onLine) {
      syncQueue();
    }
  };

  const syncQueue = async () => {
    if (!navigator.onLine || isSyncing) return;
    
    const pendingQueue: QueuedOrder[] = (await queueStorage.getItem('pending_orders')) || [];
    if (pendingQueue.length === 0) return;

    setIsSyncing(true);
    console.log(`[SYNC] Starting sync for ${pendingQueue.length} orders...`);
    
    const remainingQueue = [...pendingQueue];

    for (const order of pendingQueue) {
      try {
        // 1. Insert Transaction Header
        const invoiceNum = `INV-${new Date(order.createdAt).getTime().toString().slice(-6)}`;
        const cashierIdClean = order.cashierId && order.cashierId.trim() !== '' ? order.cashierId : null;
        const shiftIdClean = order.shiftId && order.shiftId.trim() !== '' ? order.shiftId : null;

        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .insert({
            invoice_number: invoiceNum,
            shift_id: shiftIdClean,
            cashier_id: cashierIdClean,
            subtotal: order.subtotal,
            tax: order.tax,
            grand_total: order.grandTotal,
            payment_method: order.paymentMethod,
            tender_amount: order.tenderAmount,
            change_amount: order.change,
            created_at: order.createdAt
          })
          .select('id')
          .single();

        if (txError) throw txError;
        
        // 2. Insert Transaction Items
        if (order.items && order.items.length > 0) {
          const itemsToInsert = order.items.map(item => ({
            transaction_id: txData.id,
            variant_id: item.variant.id,
            quantity: item.quantity,
            price_at_time: item.variant.price,
            subtotal: item.subtotal
          }));

          const { error: itemsError } = await supabase.from('transaction_items').insert(itemsToInsert);
          if (itemsError) console.warn("[SYNC] Warning inserting transaction_items:", itemsError);
        }

        // If success, remove from array
        remainingQueue.shift();

      } catch (err) {
        console.error(`[SYNC] Failed to sync order ${order.id}:`, err);
        // Break out of loop on first network error, try again later
        break;
      }
    }
    
    await queueStorage.setItem('pending_orders', remainingQueue);
    await refreshQueueCount();
    setIsSyncing(false);
  };

  return { queueCount, isOnline, isSyncing, enqueueOrder, syncQueue };
}
