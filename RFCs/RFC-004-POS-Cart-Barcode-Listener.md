# RFC-004: POS Terminal Cart & Hardware Barcode Scanner Listener

- **ID**: `RFC-004`
- **Title**: POS Terminal Cart & Hardware Barcode Scanner Listener
- **Predecessors**: `RFC-002`, `RFC-003`
- **Successors**: `RFC-005`
- **Features Addressed**: `F3` (Hardware Barcode Scanner Listener), `F4` (Interactive Cart & Order Calculator)
- **Target Module**: `web-pos`
- **Complexity**: Medium

---

## 1. Summary & Architecture

RFC-004 builds the main cashier terminal user interface in React with Zustand state management. It features a global hardware barcode scanner listener with a <30ms inter-keypress buffer, cart item controls, subtotal/tax calculation (PPN 11%), and keyboard shortcuts.

---

## 2. Hardware Barcode Listener Hook (`useBarcodeScanner.ts`)

```typescript
import { useEffect, useRef } from 'react';

export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      if (e.key === 'Enter') {
        if (bufferRef.current.length >= 3 && timeDiff < 50) {
          onScan(bufferRef.current);
          e.preventDefault();
        }
        bufferRef.current = '';
        return;
      }

      if (e.key.length === 1) {
        if (timeDiff > 50) {
          bufferRef.current = e.key; // Reset if human typing speed
        } else {
          bufferRef.current += e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
}
```

---

## 3. Acceptance Criteria
1. Hardware barcode scanner scans trigger item addition to cart in <100ms.
2. `F1` opens search dialog, `F2` opens payment modal, `Esc` clears cart.
3. Cart correctly calculates subtotal, PPN 11% tax, and grand total in real-time.
