# RFC-003: Product Catalog, SKU Variants & Inventory Audit Service

- **ID**: `RFC-003`
- **Title**: Product Catalog, SKU Variants & Inventory Audit Service
- **Predecessors**: `RFC-001`
- **Successors**: `RFC-004`
- **Features Addressed**: `F1` (Parent Product & Variant Management), `F2` (Stock Adjustment Audit Trail)
- **Target Module**: `backend-api` & `web-pos`
- **Complexity**: Medium

---

## 1. Summary & Architecture

RFC-003 handles product catalog CRUD operations, support for parent products with SKU variants (Size, Color), barcode mapping, and immutable stock adjustment audit logging.

---

## 2. Database Schema Extension (`schema.prisma`)

```prisma
model Category {
  id       String    @id @default(uuid())
  name     String
  products Product[]
}

model Product {
  id          String           @id @default(uuid())
  categoryId  String
  category    Category         @relation(fields: [categoryId], references: [id])
  name        String
  description String?
  variants    ProductVariant[]
}

model ProductVariant {
  id           String         @id @default(uuid())
  productId    String
  product      Product        @relation(fields: [productId], references: [id])
  variantName  String         // e.g. "Red / XL"
  sku          String         @unique
  barcode      String         @unique
  costPrice    Float
  sellingPrice Float
  stock        Int            @default(0)
  logs         InventoryLog[]
}

model InventoryLog {
  id             String         @id @default(uuid())
  variantId      String
  variant        ProductVariant @relation(fields: [variantId], references: [id])
  changeQty      Int            // Positive or Negative
  reason         String         // "SALE", "STOCK_IN", "DAMAGE", "MANUAL_ADJUSTMENT"
  createdAt      DateTime       @default(now())
}
```

---

## 3. Acceptance Criteria
1. Unique constraint on `barcode` and `sku` in `product_variants`.
2. Manual stock adjustments create an immutable `InventoryLog` row.
3. GET `/api/products/search?q=BARCODE` returns the matching product variant in under 50ms.
