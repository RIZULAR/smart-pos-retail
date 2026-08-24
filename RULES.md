# Project Architecture & Engineering Rules (`RULES.md`)
## Multipurpose Retail POS (Point of Sale) Web Application

- **Document Version**: 1.0.0
- **Status**: Active Project Standard
- **Target OS / Environment**: Modern Browsers (Chrome 120+, Edge, Safari) & Node.js 20 LTS Backend

---

## 1. Product Classification & Scope

- **Classified Product Type**: `web app` (Web Application Monorepo / Client-Server)
- **Applied Rule Categories**:
  - Web UI Component & State Management Patterns
  - Hardware Barcode Event Listener & ESC/POS Print Protocols
  - REST API & Database Transaction Standards
  - Role-Based Access Control (RBAC) Security Controls
  - Offline IndexedDB Local Queue Handling
- **Skipped Rule Categories (Audited)**:
  - C++ Native Desktop Bindings & Mobile OS Native Drivers

---

## 2. Technology Stack & Dependency Constraints

### Frontend Stack (Web POS Client)
- **Core Framework**: React `18.3.1` (Vite `5.4.1` bundler, TypeScript `5.5.4`)
- **Styling**: TailwindCSS `3.4.10` / Vanilla CSS (Dark/Light mode, high-contrast POS theme)
- **State Management**: Zustand `4.5.5` (Memoized cart & shift state)
- **Offline Storage**: `localforage` `1.10.0` (IndexedDB wrapper)
- **Thermal Printing**: `esc-pos-encoder` `1.3.0` (ESC/POS bytecode builder)
- **Icons**: `lucide-react` `0.428.0`

### Backend & Database Stack (Supabase)
- **Database**: Supabase PostgreSQL 15+ (Hosted / Local Supabase CLI)
- **Auth Engine**: Supabase Auth (JWT, Role-Based Access Control, RLS Policies)
- **Client SDK**: `@supabase/supabase-js` `2.45.0`
- **ORM / Query Builder**: Supabase Client / Prisma ORM with Supabase PostgreSQL connection
- **Server Environment**: Node.js `20.x` LTS (Express / Supabase Edge Functions)

---

## 3. Code Structure & Naming Conventions

### Directory Layout
```
POS/
├── apps/
│   ├── web-pos/                   # Frontend React POS Application
│   │   ├── src/
│   │   │   ├── components/        # React Components (PascalCase)
│   │   │   │   ├── cart/          # CartPanel.tsx, QuantitySelector.tsx
│   │   │   │   ├── catalog/       # ProductCard.tsx, VariantModal.tsx
│   │   │   │   ├── checkout/      # PaymentModal.tsx, ReceiptModal.tsx
│   │   │   │   └── shift/         # ShiftOpenModal.tsx, ShiftCloseModal.tsx
│   │   │   ├── hooks/             # Custom Hooks (camelCase: useBarcodeScanner.ts)
│   │   │   ├── store/             # Zustand Stores (useCartStore.ts, useShiftStore.ts)
│   │   │   ├── services/          # API Services & ESC/POS Printers
│   │   │   ├── types/             # TypeScript Interfaces (pos.ts)
│   │   │   └── utils/             # Formatters & Helpers (formatCurrency.ts)
│   ├── backend-api/               # Express REST API Service
│   │   ├── src/
│   │   │   ├── controllers/       # OrderController.ts, ShiftController.ts
│   │   │   ├── routes/            # order.routes.ts, shift.routes.ts
│   │   │   ├── services/          # OrderService.ts, InventoryService.ts
│   │   │   ├── middlewares/       # auth.middleware.ts, role.middleware.ts
│   │   │   └── prisma/            # schema.prisma & migrations
```

### Naming Conventions

| Artifact | Convention | Example |
| :--- | :--- | :--- |
| **React Components** | `PascalCase.tsx` | `PaymentModal.tsx`, `CartPanel.tsx` |
| **Custom Hooks** | `camelCase.ts` (`use` prefix) | `useBarcodeScanner.ts`, `useOfflineSync.ts` |
| **Zustand Stores** | `camelCase.ts` (`use` prefix) | `useCartStore.ts`, `useShiftStore.ts` |
| **API Routes & Services** | `kebab-case.ts` / `camelCase.ts` | `order.routes.ts`, `InventoryService.ts` |
| **Database Tables** | `snake_case` (plural) | `product_variants`, `cashier_shifts`, `orders` |
| **Database Columns** | `snake_case` | `variant_id`, `selling_price`, `cost_price` |

---

## 4. Architectural Rules & Engineering Best Practices

### RULE-01: No Placeholders or TODOs
- All code generated or modified by AI MUST be fully implemented and functional.
- Mocking or stubbing functions without full logic is strictly forbidden in final code outputs.

### RULE-02: Strict Type Safety
- TypeScript strict mode enabled (`"strict": true`).
- The `any` type is forbidden. All API parameters, responses, and state models must have explicit types.

### RULE-03: Barcode Event Listener Protocol (<30ms Buffer)
- Scanner listeners MUST buffer key events with a max inter-keypress interval of 30ms to distinguish barcode hardware scanner bursts from manual typing.
- Global window keydown listener must prevent default navigation when a valid scanner barcode sequence is detected.

### RULE-04: Atomic Database Transactions
- Stock quantity decrements during checkout MUST run within a database transaction (`prisma.$transaction`).
- Inventory logs (`inventory_logs`) MUST be created atomically alongside order creation.

### RULE-05: Mandatory Shift Verification Middleware
- The backend API MUST reject order creation requests (`POST /orders`) with `403 Forbidden` if the cashier has no active `OPEN` shift.

### RULE-06: Esc/POS Thermal Print Standards
- ESC/POS bytecode generation MUST occur client-side via `esc-pos-encoder`.
- Receipts must include: Store Header, Transaction ID, Cashier Name, Line Items, Subtotal, Tax (PPN 11%), Payment Method, Change Due, and Footer.

---

## 5. Agent Configuration & Wireup

To ensure AI assistants (Cursor, OpenCode, Claude Code) automatically enforce these rules:
- **Cursor Setup**: This file is mirrored to `.cursor/rules/pos-rules.mdc`.
- **OpenCode Setup**: Referenced in `AGENTS.md` and `D:\Project\PRD\RULES.md`.

---

## 6. Self-Check Verification
- **Summary Count Check**: Verified 6 explicit Engineering Rules (RULE-01 to RULE-06).
- **Traceability Audit**: Tech stack versions (React 18.3.1, Node 20 LTS, Express 4.19.2, Zustand 4.5.5) verified against registry definitions.
- **Cross-Reference Audit**: Directories and database table definitions match PRD v1.1.0 and FEATURES.md.
