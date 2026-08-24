-- ==========================================
-- MyTRA POS RETAIL - SUPABASE SCHEMA
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==========================================
-- ENUMS
-- ==========================================
create type user_role as enum ('ADMIN', 'CASHIER', 'SUPERVISOR');
create type shift_status as enum ('OPEN', 'CLOSED');
create type payment_method_type as enum ('CASH', 'QRIS', 'DEBIT');

-- ==========================================
-- TABLES
-- ==========================================

-- PROFILES (Extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text not null,
    role user_role default 'CASHIER' not null,
    pin_hash text, -- For fast POS login instead of typing password
    created_at timestamptz default now() not null
);

-- PRODUCTS & CATALOG
create table public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    category text,
    is_active boolean default true not null,
    created_at timestamptz default now() not null
);

create table public.product_variants (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    name text not null, -- e.g., "Size L - Red"
    sku text unique not null,
    barcode text unique not null,
    price numeric(12,2) not null check (price >= 0),
    stock integer not null default 0,
    image_url text,
    is_active boolean default true not null,
    created_at timestamptz default now() not null
);

-- SHIFT MANAGEMENT
create table public.shifts (
    id uuid default uuid_generate_v4() primary key,
    cashier_id uuid references public.profiles(id) not null,
    start_float numeric(12,2) not null,
    end_expected numeric(12,2),
    end_actual numeric(12,2),
    status shift_status default 'OPEN' not null,
    opened_at timestamptz default now() not null,
    closed_at timestamptz
);

-- TRANSACTIONS
create table public.transactions (
    id uuid default uuid_generate_v4() primary key,
    invoice_number text unique not null, -- e.g., INV-20260824-001
    shift_id uuid references public.shifts(id) not null,
    cashier_id uuid references public.profiles(id) not null,
    subtotal numeric(12,2) not null check (subtotal >= 0),
    tax numeric(12,2) not null check (tax >= 0),
    grand_total numeric(12,2) not null check (grand_total >= 0),
    payment_method payment_method_type not null,
    tender_amount numeric(12,2) not null check (tender_amount >= 0),
    change_amount numeric(12,2) not null default 0,
    created_at timestamptz default now() not null
);

create table public.transaction_items (
    id uuid default uuid_generate_v4() primary key,
    transaction_id uuid references public.transactions(id) on delete cascade not null,
    variant_id uuid references public.product_variants(id) not null,
    quantity integer not null check (quantity > 0),
    price_at_time numeric(12,2) not null check (price_at_time >= 0),
    subtotal numeric(12,2) not null check (subtotal >= 0)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.shifts enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;

-- (For this Mockup/Development phase, we will allow authenticated users to read/write)
-- In production, restrict based on role!
create policy "Enable ALL for authenticated users" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Enable ALL for authenticated users" on public.products for all using (auth.role() = 'authenticated');
create policy "Enable ALL for authenticated users" on public.product_variants for all using (auth.role() = 'authenticated');
create policy "Enable ALL for authenticated users" on public.shifts for all using (auth.role() = 'authenticated');
create policy "Enable ALL for authenticated users" on public.transactions for all using (auth.role() = 'authenticated');
create policy "Enable ALL for authenticated users" on public.transaction_items for all using (auth.role() = 'authenticated');
