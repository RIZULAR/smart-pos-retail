-- ==========================================
-- SEED DATA FOR RESTAURANT / CAFE POS
-- ==========================================

-- 1. Insert Products (Categories: Food & Beverages)
INSERT INTO public.products (id, name, description, category, is_active)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Nasi Goreng Spesial + Telur', 'Nasi goreng racikan spesial dengan telur ceplok dan kerupuk', 'Makanan Utama', true),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Es Teh Manis Jumbo', 'Es teh manis segar ukuran jumbo 500ml', 'Minuman', true),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Ayam Goreng Lengkuas + Nasi', 'Ayam goreng kremes lengkuas gurih dan sambal korek', 'Makanan Utama', true),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Kopi Susu Gula Aren', 'Espresso dengan susu segar dan gula aren asli', 'Minuman', true),
  ('a1b2c3d4-0000-0000-0000-000000000005', 'Kentang Goreng (French Fries)', 'Kentang goreng renyah bumbu keju/original', 'Cemilan', true),
  ('a1b2c3d4-0000-0000-0000-000000000006', 'Double Cheese Beef Burger', 'Burger daging sapi pilihan dengan 2 lapis keju leleh', 'Makanan Utama', true);

-- 2. Insert Variants (Scannable Menu Items)
INSERT INTO public.product_variants (product_id, name, sku, barcode, price, stock, image_url, is_active)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Nasi Goreng Spesial + Telur', 'NASGOR-SPL', '8991234567890', 32000, 45, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=300&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Es Teh Manis Jumbo', 'ESTEH-JMB', '8990987654321', 8000, 100, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=300&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Ayam Goreng Lengkuas + Nasi', 'AYAM-LKG', '8991122334455', 35000, 3, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=300&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Kopi Susu Gula Aren', 'KOPI-AREN', '8995544332211', 22000, 60, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000005', 'Kentang Goreng (French Fries)', 'FRIES-REG', '8996677889900', 18000, 30, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=300&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000006', 'Double Cheese Beef Burger', 'BRG-DBL-CHS', '8997788990011', 45000, 20, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop', true);
