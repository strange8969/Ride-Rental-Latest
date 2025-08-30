-- Simple fix for missing columns in bookings table
-- Run this in your Supabase SQL Editor

-- Add the missing 'days' column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS days INTEGER DEFAULT 1;

-- Add the missing 'total_price' column  
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);

-- Add the missing 'updated_at' column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Update existing records to have default values
UPDATE bookings 
SET days = 1 
WHERE days IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
