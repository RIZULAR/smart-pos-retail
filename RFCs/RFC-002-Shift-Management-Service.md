# RFC-002: Cashier Shift Management & Verification Middleware

- **ID**: `RFC-002`
- **Title**: Cashier Shift Management & Verification Middleware
- **Predecessors**: `RFC-001`
- **Successors**: `RFC-004`
- **Features Addressed**: `F8` (Mandatory Shift Opening), `F9` (Shift Closing & Cash Reconciliation Audit)
- **Target Module**: `backend-api`
- **Complexity**: Medium

---

## 1. Summary & Architecture

RFC-002 implements the cashier shift lifecycle: Opening Shift with an initial cash float, tracking shift status (`OPEN` / `CLOSED`), closing shift with physical cash counts, and auditing cash variances.

---

## 2. Database Schema Extension (`schema.prisma`)

```prisma
enum ShiftStatus {
  OPEN
  CLOSED
}

model CashierShift {
  id           String      @id @default(uuid())
  userId       String
  user         User        @relation(fields: [userId], references: [id])
  startFloat   Float
  expectedCash Float       @default(0)
  actualCash   Float?
  cashVariance Float?
  status       ShiftStatus @default(OPEN)
  openedAt     DateTime    @default(now())
  closedAt     DateTime?
  orders       Order[]
}
```

---

## 3. API Contracts

### `POST /api/shifts/open`
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**: `{ "startFloat": 500000 }`
- **Response 201 Created**: Returns created `CashierShift` object.

### `POST /api/shifts/close`
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**: `{ "shiftId": "shift-101", "actualCash": 1250000 }`
- **Response 200 OK**: Calculates `expectedCash` and `cashVariance` (Actual - Expected). Returns closed shift audit report.

---

## 4. Acceptance Criteria
1. `POST /api/shifts/open` blocks opening a new shift if cashier already has an active `OPEN` shift.
2. `POST /api/shifts/close` calculates variance correctly (`cashVariance = actualCash - expectedCash`).
3. `shift.middleware.ts` rejects order attempts if cashier has no `OPEN` shift (`403 Forbidden`).
