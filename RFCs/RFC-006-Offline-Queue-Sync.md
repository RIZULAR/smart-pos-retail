# RFC-006: Offline Transaction Queue & Automatic Data Synchronization

- **ID**: `RFC-006`
- **Title**: Offline Transaction Queue & Automatic Data Synchronization
- **Predecessors**: `RFC-005`
- **Successors**: None
- **Features Addressed**: `F5` (Offline Queue & Automatic Data Synchronization)
- **Target Module**: `web-pos`
- **Complexity**: High

---

## 1. Summary & Architecture

RFC-006 provides offline resiliency for the Web POS application. Using `localforage` (IndexedDB), pending transactions created while offline are stored locally in an offline queue and automatically background-synced when internet connectivity is restored.

---

## 2. Offline Queue Sync Architecture (`useOfflineSync.ts`)

```typescript
import localforage from 'localforage';

const queueStorage = localforage.createInstance({ name: 'mytra_pos_offline_queue' });

export async function enqueueOfflineOrder(orderPayload: any) {
  const pendingQueue: any[] = (await queueStorage.getItem('pending_orders')) || [];
  pendingQueue.push({ ...orderPayload, localId: `local-${Date.now()}` });
  await queueStorage.setItem('pending_orders', pendingQueue);
}

export async function syncOfflineOrders(apiClient: any) {
  const pendingQueue: any[] = (await queueStorage.getItem('pending_orders')) || [];
  if (pendingQueue.length === 0) return;

  const remainingQueue = [];
  for (const order of pendingQueue) {
    try {
      await apiClient.post('/api/orders', order);
    } catch (err) {
      remainingQueue.push(order); // Retain if server error
    }
  }

  await queueStorage.setItem('pending_orders', remainingQueue);
}
```

---

## 3. Acceptance Criteria
1. Cashier can complete transactions when `navigator.onLine === false`.
2. UI displays "Offline Mode - X Orders Queued".
3. Auto-sync uploads pending orders seamlessly upon `online` window event without duplicate entries.
