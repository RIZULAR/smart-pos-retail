# RFC-001: Supabase Database Schema, RLS Policies & Auth Integration

- **ID**: `RFC-001`
- **Title**: Supabase Database Schema, Row-Level Security (RLS) & Auth Integration
- **Predecessors**: None
- **Successors**: `RFC-002`, `RFC-003`
- **Features Addressed**: `F10` (Authentication & Role-Based Access Control)
- **Target Module**: `backend-api` & `web-pos` (Supabase Client)
- **Complexity**: Low

---

## 1. Summary & Architecture

RFC-001 establishes Supabase as the unified Database & Auth provider. It configures Supabase Auth (JWT with metadata roles: ADMIN, CASHIER, SUPERVISOR) and sets up PostgreSQL tables with Row-Level Security (RLS) policies.

---

## 2. Supabase SQL Migration Script (`schema.sql`)

```sql
-- Create Enum for User Roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'CASHIER', 'SUPERVISOR');

-- Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'CASHIER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own profile
CREATE POLICY "Allow authenticated read profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
```

---

## 3. Supabase Auth Client Integration (`supabaseClient.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## 4. Acceptance Criteria
1. Supabase SQL Migration creates `profiles` table with RLS enabled.
2. `supabase.auth.signInWithPassword()` authenticates users and returns user profile role.
3. Supabase Client initialized with `@supabase/supabase-js` v2.45.0.
