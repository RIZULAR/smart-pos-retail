-- ==========================================
-- SEED DATA FOR SUPABASE
-- ==========================================

-- Note: In a real environment, you must first create a User in Supabase Auth (Authentication menu), 
-- then copy that user's UUID here into the profiles table.
-- For this seed, we will just insert products.

-- 1. Insert Products
INSERT INTO public.products (id, name, description, category, is_active)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Classic Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 'Clothing', true),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Nike Air Force 1', 'Classic sneakers', 'Shoes', true),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Denim Jacket Vintage', 'Blue vintage jacket', 'Clothing', true),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Minimalist Smart Watch', 'Digital smartwatch with heart monitor', 'Accessories', true);

-- 2. Insert Variants (The items actually scanned)
INSERT INTO public.product_variants (product_id, name, sku, barcode, price, stock, image_url, is_active)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Classic Cotton T-Shirt - White / XL', 'TSH-WHT-XL', '8991234567890', 125000, 12, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=250&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Nike Air Force 1 - Red/Black / 42', 'NK-AF1-RB-42', '8990987654321', 1450000, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=250&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Denim Jacket Vintage Blue / M', 'JCK-BLU-M', '8991122334455', 450000, 1, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=250&auto=format&fit=crop', true),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Minimalist Smart Watch', 'WTC-SMART-01', '8995544332211', 899000, 24, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=250&auto=format&fit=crop', true);
