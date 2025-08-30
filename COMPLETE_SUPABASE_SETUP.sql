-- ====================================
-- COMPLETE SUPABASE SETUP FOR RIDE RENTAL APP
-- ====================================
-- Copy and paste this entire script into your Supabase SQL Editor
-- This will create all necessary tables and configurations

-- ====================================
-- 1. BOOKINGS TABLE (for "Book Now" functionality)
-- ====================================

-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  price_per_day NUMERIC(10, 2) NOT NULL DEFAULT 0,
  days INTEGER DEFAULT 1,
  total_price NUMERIC(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  rental_type TEXT DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Check and add 'days' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'days') THEN
        ALTER TABLE bookings ADD COLUMN days INTEGER DEFAULT 1;
        RAISE NOTICE 'Added days column to bookings table';
    END IF;
    
    -- Check and add 'total_price' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'total_price') THEN
        ALTER TABLE bookings ADD COLUMN total_price NUMERIC(10, 2);
        RAISE NOTICE 'Added total_price column to bookings table';
    END IF;
    
    -- If total_price column exists but is NOT NULL, make it nullable or set default
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'bookings' AND column_name = 'total_price' AND is_nullable = 'NO') THEN
        -- Set default value for the column
        ALTER TABLE bookings ALTER COLUMN total_price SET DEFAULT 0;
        -- Update any NULL values to 0
        UPDATE bookings SET total_price = 0 WHERE total_price IS NULL;
        RAISE NOTICE 'Updated total_price column with default value';
    END IF;
    
    -- Check and add 'updated_at' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'updated_at') THEN
        ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE 'Added updated_at column to bookings table';
    END IF;
    
    -- Check and add 'rental_type' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'rental_type') THEN
        ALTER TABLE bookings ADD COLUMN rental_type TEXT DEFAULT 'daily';
        RAISE NOTICE 'Added rental_type column to bookings table';
    END IF;
    
    -- If rental_type column exists but has no default, set it
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'bookings' AND column_name = 'rental_type') THEN
        -- Update any NULL values to 'daily'
        UPDATE bookings SET rental_type = 'daily' WHERE rental_type IS NULL;
        -- Set default value for the column
        ALTER TABLE bookings ALTER COLUMN rental_type SET DEFAULT 'daily';
        RAISE NOTICE 'Updated rental_type column with default value';
    END IF;
END $$;

-- ====================================
-- 2. CONTACTS TABLE (for "Contact Us" functionality)
-- ====================================

-- Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================
-- 3. ROW LEVEL SECURITY (RLS) SETUP
-- ====================================

-- Enable RLS on both tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 4. DROP EXISTING POLICIES (if any)
-- ====================================

-- Bookings policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON bookings;

-- Contacts policies
DROP POLICY IF EXISTS "Anyone can create contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can read contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can view contacts" ON contacts;

-- ====================================
-- 5. CREATE POLICIES FOR ANONYMOUS ACCESS
-- ====================================

-- Bookings table policies
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Contacts table policies
CREATE POLICY "Anyone can create contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view contacts"
  ON contacts
  FOR SELECT
  TO anon
  USING (true);

-- ====================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ====================================

-- Bookings indexes
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_category_idx ON bookings(category);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);

-- ====================================
-- 7. CREATE UPDATED_AT TRIGGER FUNCTION
-- ====================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ====================================
-- 8. CREATE TRIGGERS
-- ====================================

-- Trigger for bookings table
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contacts table
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 9. INSERT TEST DATA
-- ====================================

-- Test booking record
INSERT INTO bookings (name, contact, address, category, model, price_per_day, days, total_price, status, rental_type)
VALUES (
  'Test User', 
  '9999999999', 
  'Test Address for Setup Verification', 
  'Test Category', 
  'Setup Test', 
  100, 
  1, 
  100, 
  'test',
  'daily'
) ON CONFLICT DO NOTHING;

-- Test contact record
INSERT INTO contacts (name, email, phone, subject, message, status)
VALUES (
  'Test Contact', 
  'test@example.com', 
  '9999999999', 
  'Setup Test', 
  'This is a test message to verify contact form setup', 
  'test'
) ON CONFLICT DO NOTHING;

-- ====================================
-- 10. VERIFICATION QUERIES
-- ====================================

-- Verify bookings table
SELECT 
  'BOOKINGS TABLE SETUP' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE status = 'test') as test_records
FROM bookings;

-- Verify contacts table
SELECT 
  'CONTACTS TABLE SETUP' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE status = 'test') as test_records
FROM contacts;

-- Show table structures
SELECT 
  'BOOKINGS COLUMNS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

SELECT 
  'CONTACTS COLUMNS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;

-- ====================================
-- SETUP COMPLETE!
-- ====================================
-- Your Supabase database is now ready for:
-- ✅ Book Now functionality (bookings table)
-- ✅ Contact Us functionality (contacts table)
-- ✅ Anonymous access (no authentication required)
-- ✅ Automatic timestamps and indexing
-- ✅ Performance optimizations
-- ====================================
