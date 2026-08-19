-- Row Level Security policies for FarmLink NG (reworked)
-- This file creates SECURITY DEFINER helper functions and safe RLS policies
-- to avoid self-referential subselects that can cause policy recursion.
-- Run this file in the Supabase SQL editor (or psql) as a project SQL migration.

-- IMPORTANT: Review and backup your data before running in production.

-- =============================
-- Helper functions (SECURITY DEFINER)
-- =============================

-- Returns true if the given uid belongs to an admin
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin'
  );
$$;

-- Returns true if the given uid belongs to a farmer with verification_status = 'verified'
CREATE OR REPLACE FUNCTION public.is_verified_farmer(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'farmer' AND verification_status = 'verified'
  );
$$;

-- Returns the stored role for a uid (NULL if none)
CREATE OR REPLACE FUNCTION public.get_role(uid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

-- Returns the stored verification_status for a uid (NULL if none)
CREATE OR REPLACE FUNCTION public.get_verification_status(uid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT verification_status FROM public.profiles WHERE id = uid;
$$;


-- =============================
-- Profiles table policies
-- =============================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any previous conflicting policies (safe to run multiple times)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_owner_full') THEN
    EXECUTE 'DROP POLICY IF EXISTS profiles_owner_full ON public.profiles';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'profiles_admin_bypass') THEN
    EXECUTE 'DROP POLICY IF EXISTS profiles_admin_bypass ON public.profiles';
  END IF;
END$$;

-- Ensure no conflicting policy, then allow owners to SELECT their own profile
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Ensure no conflicting policy, then allow authenticated users to INSERT their own profile (id must equal auth.uid())
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure no conflicting policy, then allow owners to UPDATE their own profile but prevent them from changing role/verification_status
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = public.get_role(auth.uid())
    AND verification_status = public.get_verification_status(auth.uid())
  );

-- Ensure no conflicting policy, then allow owners to DELETE their own profile (if you want this behaviour)
DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;
CREATE POLICY profiles_delete_own
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Ensure no conflicting admin policies, then allow admins full SELECT/UPDATE/INSERT/DELETE access
DROP POLICY IF EXISTS profiles_admin_select ON public.profiles;
CREATE POLICY profiles_admin_select
  ON public.profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS profiles_admin_update ON public.profiles;
CREATE POLICY profiles_admin_update
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS profiles_admin_insert ON public.profiles;
CREATE POLICY profiles_admin_insert
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS profiles_admin_delete ON public.profiles;
CREATE POLICY profiles_admin_delete
  ON public.profiles
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Ensure no conflicting policy, then allow public SELECT of only verified farmers (for marketplace listings)
DROP POLICY IF EXISTS profiles_public_verified_farmers ON public.profiles;
CREATE POLICY profiles_public_verified_farmers
  ON public.profiles
  FOR SELECT
  USING (public.is_verified_farmer(id));


-- =============================
-- Products table policies
-- =============================

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop previous product policies if present (optional)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'products_public_select') THEN
    EXECUTE 'DROP POLICY IF EXISTS products_public_select ON public.products';
  END IF;
END$$;

-- Ensure no conflicting policy, then allow public SELECT of products
DROP POLICY IF EXISTS products_public_select ON public.products;
CREATE POLICY products_public_select
  ON public.products
  FOR SELECT
  USING (true);

-- Ensure no conflicting policy, then allow INSERT only when caller is the farmer and verified, or when caller is admin
DROP POLICY IF EXISTS products_insert_verified_farmers_or_admin ON public.products;
CREATE POLICY products_insert_verified_farmers_or_admin
  ON public.products
  FOR INSERT
  WITH CHECK (
    (
      auth.uid() = farmer_id
      AND public.is_verified_farmer(auth.uid())
    )
    OR public.is_admin(auth.uid())
  );

-- Ensure no conflicting policy, then allow UPDATE only for owner or admin
DROP POLICY IF EXISTS products_update_owner_or_admin ON public.products;
CREATE POLICY products_update_owner_or_admin
  ON public.products
  FOR UPDATE
  USING (
    auth.uid() = farmer_id
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = farmer_id
    OR public.is_admin(auth.uid())
  );

-- Ensure no conflicting policy, then allow DELETE only for owner or admin
DROP POLICY IF EXISTS products_delete_owner_or_admin ON public.products;
CREATE POLICY products_delete_owner_or_admin
  ON public.products
  FOR DELETE
  USING (
    auth.uid() = farmer_id
    OR public.is_admin(auth.uid())
  );


-- =============================
-- Notes
-- - Apply this file in the Supabase SQL editor. If you already have policies, either drop them
--   first or run this migration which uses IF NOT EXISTS and DROP where appropriate.
-- - The helper functions run with SECURITY DEFINER, so policy logic that needs to consult
--   the `profiles` table will not trigger recursive policy evaluation.
-- - After applying, test the following flows:
--   1) Fetch a public list of verified farmers: SELECT ... FROM profiles WHERE role='farmer' AND verification_status='verified';
--   2) As a newly-registered farmer (unverified), attempt to INSERT into `products` (should fail).
--   3) As an admin, UPDATE a farmer's `verification_status` to 'verified', then re-run the insert test.

-- End of file
