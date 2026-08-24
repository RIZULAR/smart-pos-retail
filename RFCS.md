# Request for Comments (RFCs) Master Index & Implementation Roadmap

- **Document Version**: 1.0.0
- **Status**: Implementation-Ready Roadmap
- **Source Documents**: `PRD.md` v1.1.0, `FEATURES.md` v1.0.0, `RULES.md` v1.0.0
- **Command Handoff**: Each RFC is implemented by running `/implement-rfc <RFC-ID>`

---

## 1. Implementation Roadmap & Dependency Matrix

The project is broken down into **6 sequenced, topologically ordered RFC units**. Each RFC represents an independent, testable module that can be implemented once its explicit predecessors are complete.

| RFC ID | RFC Title | Features Covered | Predecessors | Complexity | Target Module |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **RFC-001** | Database Schema, Migration & Authentication Base | `F10` | None | Low | `backend-api` |
| **RFC-002** | Cashier Shift Management & Verification Middleware | `F8`, `F9` | `RFC-001` | Medium | `backend-api` |
| **RFC-003** | Product Catalog, SKU Variants & Inventory Audit Service | `F1`, `F2` | `RFC-001` | Medium | `backend-api` & `web-pos` |
| **RFC-004** | POS Terminal Cart & Hardware Barcode Scanner Listener | `F3`, `F4` | `RFC-002`, `RFC-003` | Medium | `web-pos` |
| **RFC-005** | Checkout Processing, Multi-Payment & ESC/POS Thermal Printing | `F6`, `F7` | `RFC-004` | Medium | `web-pos` & `backend-api` |
| **RFC-006** | Offline Transaction Queue & Automatic Data Synchronization | `F5` | `RFC-005` | High | `web-pos` |

---

## 2. Directed Dependency Graph

```
[ RFC-001: DB Schema & Auth ]
       ├───> [ RFC-002: Shift Management & Middleware ] ───────┐
       └───> [ RFC-003: Catalog, Variants & Stock Audit ] ────┼───> [ RFC-004: POS Cart & Barcode Scanner ]
                                                                       │
                                                                       ▼
                                                          [ RFC-005: Checkout & ESC/POS Print ]
                                                                       │
                                                                       ▼
                                                          [ RFC-006: Offline Queue & Sync ]
```

---

## 3. RFC Specifications Checklist

- [x] **RFC-001**: `RFCs/RFC-001-Database-Schema-Auth.md`
- [x] **RFC-002**: `RFCs/RFC-002-Shift-Management-Service.md`
- [x] **RFC-003**: `RFCs/RFC-003-Catalog-Variant-Management.md`
- [x] **RFC-004**: `RFCs/RFC-004-POS-Cart-Barcode-Listener.md`
- [x] **RFC-005**: `RFCs/RFC-005-Checkout-Payment-Thermal-Print.md`
- [x] **RFC-006**: `RFCs/RFC-006-Offline-Queue-Sync.md`

---

## 4. Cold-Read Quality Check Instructions
Before initiating implementation of any RFC, run a fresh session cold-read check:
> Hand `PRD.md`, `FEATURES.md`, `RULES.md` and the single target `RFC-xxx.md` to an AI session and ask:
> **"What would you have to guess to implement this?"**
> Address any surfaced ambiguity before executing `/implement-rfc <RFC-ID>`.
