# Product Feature Requirements Specification (`FEATURES.md`)
## Multipurpose Retail POS (Point of Sale) Web Application

- **Document Version**: 1.0.0
- **Status**: Verified & Ready for Implementation Planning
- **Source Document**: `PRD.md` v1.1.0

---

## 1. Summary Matrix & Feature Breakdown

### Summary by Priority (MoSCoW)
- **Must Have (M)**: 10 Features (MVP Scope)
- **Should Have (S)**: 2 Features (Phase 2)
- **Could Have (C)**: 1 Feature (Phase 3)
- **Won't Have (W)**: 1 Feature (Deferred to v2.0)
- **Total Features**: 14 Features

### Feature Count Table by Category & Priority

| Category | Must Have (M) | Should Have (S) | Could Have (C) | Won't Have (W) | Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **1. Catalog & Inventory** | 2 | 0 | 0 | 0 | **2** |
| **2. Checkout & Barcode** | 3 | 0 | 0 | 0 | **3** |
| **3. Payments & Thermal Print** | 2 | 0 | 0 | 0 | **2** |
| **4. Shift Management** | 2 | 0 | 0 | 0 | **2** |
| **5. Security & Access Control** | 1 | 0 | 0 | 0 | **1** |
| **6. Analytics & Supervision** | 0 | 2 | 0 | 0 | **2** |
| **7. Advanced Features** | 0 | 0 | 1 | 1 | **2** |
| **TOTAL** | **10** | **2** | **1** | **1** | **14** |

---

## 2. Feature Identification & Detailed Specifications

### Category 1: Catalog & Inventory Management

#### [F1] Parent Product & Variant Management (SKU & Barcode)
- **Priority**: Must Have (M)
- **Target Persona**: Admin / Store Manager
- **Complexity**: Medium
- **Description**: Allows administrators to create parent products with multiple SKU variants (e.g., T-Shirt -> Red / XL). Each variant has its own unique SKU, barcode, cost price (COGS), selling price, and stock count.
- **Acceptance Criteria**:
  - Admin can add a parent product with category, brand, and description.
  - Admin can generate or input unique Barcode and SKU for each variant.
  - Stock quantity is maintained per variant SKU.
- **Technical Considerations**: Relational DB schema with `products` and `product_variants` tables. Unique index constraint on `barcode` and `sku`.
- **Edge Cases**: Duplicate barcode entry attempt must throw a clear user validation error.

#### [F2] Stock Adjustment Audit Trail
- **Priority**: Must Have (M)
- **Target Persona**: Admin / Store Manager / Supervisor
- **Complexity**: Low
- **Description**: Records every manual inventory adjustment (stock in, stock out, damage write-off, initial inventory count) with mandatory reason and timestamp.
- **Acceptance Criteria**:
  - Admin can adjust stock count up or down.
  - Every change creates an immutable record in `inventory_logs`.
- **Technical Considerations**: Atomic DB transaction updating variant stock and logging audit row.
- **Edge Cases**: Stock cannot be set to negative values unless backorder flag is enabled.

---

### Category 2: Checkout & Barcode Scanner Integration

#### [F3] Hardware Barcode Scanner Listener
- **Priority**: Must Have (M)
- **Target Persona**: Cashier
- **Complexity**: Medium
- **Description**: A high-speed global keyboard event listener (<30ms keydown buffer) that captures hardware barcode scans regardless of which DOM input element currently has focus.
- **Acceptance Criteria**:
  - Scanning a physical product barcode instantly adds 1 unit of the matching variant to the active cart.
  - Sound/visual flash feedback upon successful scan.
  - Scan to cart addition happens in under 100ms.
- **Technical Considerations**: Use global `keydown` buffer timing to distinguish barcode scanner burst typing from human typing.
- **Edge Cases**: If scanned barcode is not found, trigger a distinct error chime and toast notification.

#### [F4] Interactive Cart & Order Calculator
- **Priority**: Must Have (M)
- **Target Persona**: Cashier
- **Complexity**: Low
- **Description**: Displays active cart items, variant options, item quantity controls (+/-), line-item discounts, subtotal, tax (Inclusive/Exclusive PPN 11%), and order grand total.
- **Acceptance Criteria**:
  - Keyboard shortcuts supported (`F1` Search, `F2` Pay, `Esc` Clear Cart).
  - Quantities update line subtotal and order grand total in real-time.
- **Technical Considerations**: Client-state management (React state / Zustand) with instant memoized re-calculation.

#### [F5] Offline Queue & Automatic Synchronization
- **Priority**: Must Have (M)
- **Target Persona**: Cashier
- **Complexity**: High
- **Description**: Stores pending sales transactions in local IndexedDB when internet connection is lost. Automatically syncs pending orders to the backend when online connectivity is restored.
- **Acceptance Criteria**:
  - Cashier can complete transactions while offline.
  - Banner indicates "Offline Mode - X Orders Pending Sync".
  - Auto-sync triggers seamlessly upon network reconnection.
- **Technical Considerations**: PWA Service Worker + IndexedDB queue with idempotent background sync API.
- **Edge Cases**: Concurrent offline order sync must handle stock concurrency gracefully.

---

### Category 3: Payments & Thermal Receipt Printing

#### [F6] Multi-Payment Processing
- **Priority**: Must Have (M)
- **Target Persona**: Cashier
- **Complexity**: Low
- **Description**: Supports checkout using Cash (with quick change calculator buttons: Exact, 20k, 50k, 100k), QRIS (Static/Dynamic QR display), Debit/Credit Card, and Bank Transfer.
- **Acceptance Criteria**:
  - Cash payment calculates exact change due.
  - Payment method is logged in transaction record.
- **Technical Considerations**: Validate tender amount >= grand total for cash transactions.

#### [F7] ESC/POS Thermal Printing Integration
- **Priority**: Must Have (M)
- **Target Persona**: Cashier
- **Complexity**: Medium
- **Description**: Generates raw ESC/POS printer byte commands sent via Web Serial API or Web Bluetooth to thermal receipt printers (58mm / 80mm format). Fallback to standard browser print dialog.
- **Acceptance Criteria**:
  - Prints store header, cashier name, itemized list, subtotal, tax, payment method, change, and footer message.
  - Support automatic paper cut command.
- **Technical Considerations**: Use `esc-pos-encoder` for fast client-side ESC/POS bytecode generation.

---

### Category 4: Cashier Shift Management & Cash Accountability

#### [F8] Mandatory Shift Opening
- **Priority**: Must Have (M)
- **Target Persona**: Cashier
- **Complexity**: Low
- **Description**: Prevents cashier from accessing the sales terminal until an initial cash drawer float (e.g. Rp 500.000) is submitted.
- **Acceptance Criteria**:
  - Cashier is prompted with Shift Open Modal upon login.
  - Active shift ID is attached to all subsequent orders.
- **Technical Considerations**: Middleware blocking order creation API calls if no active shift exists for cashier.

#### [F9] Shift Closing & Cash Reconciliation Audit
- **Priority**: Must Have (M)
- **Target Persona**: Cashier / Supervisor
- **Complexity**: Medium
- **Description**: At shift end, cashier inputs actual physical cash count. System calculates Expected Cash (Opening Float + Total Cash Sales) and outputs Variance (Expected vs Actual).
- **Acceptance Criteria**:
  - Generates Shift Summary Audit Report (Cash sales, QRIS sales, card sales, variance).
  - Shift status is marked `CLOSED`.
- **Technical Considerations**: Audit log of variance discrepancies flagged for supervisor review.

---

### Category 5: Security & Access Control

#### [F10] Authentication & Role-Based Access Control (RBAC)
- **Priority**: Must Have (M)
- **Target Persona**: Admin / Cashier / Supervisor
- **Complexity**: Low
- **Description**: Secures system access using JWT authentication. Roles enforce strict route and action permissions (Admin, Cashier, Supervisor).
- **Acceptance Criteria**:
  - Cashiers cannot edit prices or access financial reports.
  - Passwords stored securely with bcrypt hashing.

---

### Category 6: Analytics & Supervision (Phase 2 Scope)

#### [F11] Sales Analytics Dashboard & Low Stock Alerts
- **Priority**: Should Have (S)
- **Target Persona**: Admin / Store Manager
- **Complexity**: Medium
- **Description**: Visual charts showing daily/monthly revenue trends, top-selling SKUs, and alert badges for items below minimum stock threshold.

#### [F12] Transaction Void & Supervisor Override PIN
- **Priority**: Should Have (S)
- **Target Persona**: Supervisor
- **Complexity**: Medium
- **Description**: Requires Supervisor PIN authorization to void a completed order or apply custom line-item discounts exceeding 20%.

---

### Category 7: Advanced Features (Future Scope)

#### [F13] Customer Loyalty Points & Membership System
- **Priority**: Could Have (C)
- **Target Persona**: Cashier / Admin
- **Complexity**: Medium
- **Description**: Allows recording customer phone number to accumulate loyalty points for future checkout discounts.

#### [F14] Multi-Outlet Inter-Store Stock Transfer
- **Priority**: Won't Have (W)
- **Target Persona**: Admin
- **Complexity**: High
- **Description**: Multi-branch stock transfer management (Deferred to v2.0).

---

## 3. Self-Check Verification
- **Summary Table Reconciliation**: Verified counts in table: 10 Must Have, 2 Should Have, 1 Could Have, 1 Won't Have. Total = 14. Matches individual feature entries F1 to F14 exactly.
- **Traceability Audit**: Feature IDs F1 to F14 match PRD v1.1.0 requirements.
- **Table Consistency**: Priority categories across all summary tables are 100% synchronized.
