# RFC-005: Checkout Processing, Multi-Payment & ESC/POS Thermal Printing

- **ID**: `RFC-005`
- **Title**: Checkout Processing, Multi-Payment & ESC/POS Thermal Printing
- **Predecessors**: `RFC-004`
- **Successors**: `RFC-006`
- **Features Addressed**: `F6` (Multi-Payment Processing), `F7` (ESC/POS Thermal Printing Integration)
- **Target Module**: `web-pos` & `backend-api`
- **Complexity**: Medium

---

## 1. Summary & Architecture

RFC-005 implements the checkout flow: handling Cash (with quick change options), QRIS, Debit/Credit Card, updating database inventory atomically via Prisma transactions, and sending raw ESC/POS bytecode to thermal receipt printers (58mm/80mm).

---

## 2. ESC/POS Receipt Printing Driver (`escposPrinter.ts`)

```typescript
import EscPosEncoder from 'esc-pos-encoder';

export function generateReceiptBytecode(orderData: any): Uint8Array {
  const encoder = new EscPosEncoder();
  let result = encoder
    .initialize()
    .align('center')
    .size('large')
    .text('MYTRA POS RETAIL\n')
    .size('normal')
    .text('Jl. Merdeka No. 123, Jakarta\n')
    .line('--------------------------------')
    .align('left');

  orderData.items.forEach((item: any) => {
    result.text(`${item.name} (${item.variantName})\n`);
    result.text(`  ${item.qty} x Rp ${item.price.toLocaleString()} = Rp ${(item.qty * item.price).toLocaleString()}\n`);
  });

  result
    .line('--------------------------------')
    .text(`TOTAL: Rp ${orderData.total.toLocaleString()}\n`)
    .text(`CASH: Rp ${orderData.tenderAmount.toLocaleString()}\n`)
    .text(`CHANGE: Rp ${orderData.change.toLocaleString()}\n`)
    .align('center')
    .text('\nTerima Kasih Atas Kunjungan Anda!\n\n')
    .cut();

  return result.encode();
}
```

---

## 3. Acceptance Criteria
1. Order API creates transaction, updates stock, and logs inventory audit within a single DB transaction.
2. Direct raw ESC/POS byte sequence generated via `esc-pos-encoder` sends paper cut command.
3. Quick cash tender buttons (Exact, Rp 20.000, Rp 50.000, Rp 100.000) calculate change automatically.
