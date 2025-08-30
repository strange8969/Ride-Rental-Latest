-- UPDATE BOOKINGS TABLE SCHEMA
-- Run this in your Supabase SQL Editor to add missing fields

-- Add missing columns to existing bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS days integer,
ADD COLUMN IF NOT EXISTS total_price integer,
ADD COLUMN IF NOT EXISTS rental_type text DEFAULT 'daily';

-- Update any existing records to have default values
UPDATE public.bookings 
SET 
  days = 1,
  total_price = price_per_day,
  rental_type = 'daily'
WHERE days IS NULL OR total_price IS NULL OR rental_type IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND table_schema = 'public'
ORDER BY ordinal_position;
