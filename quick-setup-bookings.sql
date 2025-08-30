-- Quick setup script for bookings table
-- Run this in your Supabase SQL editor if the table doesn't exist

-- First, drop the table if it exists (optional - only if you want a fresh start)
-- DROP TABLE IF EXISTS bookings;

-- Create the bookings table with proper structure
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  price_per_day NUMERIC(10, 2) NOT NULL,
  days INTEGER DEFAULT 1,
  total_price NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'pending',
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
    
    -- Check and add 'updated_at' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'updated_at') THEN
        ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE 'Added updated_at column to bookings table';
    END IF;
END $$;

-- Enable row level security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;

-- Create policies to allow anonymous access
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- Insert a test record to verify everything works
INSERT INTO bookings (name, contact, address, category, model, price_per_day, status)
VALUES ('Test Connection', '9999999999', 'Test Address for Connection', 'Test', 'Connection Test', 1, 'test')
ON CONFLICT DO NOTHING;

-- Check if the table was created successfully
SELECT 'Bookings table setup complete!' as message,
       COUNT(*) as record_count
FROM bookings;
