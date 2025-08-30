-- SQL for setting up the bookings table in your Supabase project
-- This file is specifically for project: tybqzpwhefxrcfcsqqef

-- First, drop the existing table if it exists and you want to start fresh
-- Uncomment the next line if you want to recreate the table from scratch
-- DROP TABLE IF EXISTS public.bookings;

-- Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
   id uuid not null default gen_random_uuid(),
   name text not null,
   contact text not null,
   address text not null,
   category text not null,
   model text not null,
   price_per_day integer not null, 
   status text null default 'pending'::text,
   created_at timestamp with time zone null default now(),
   updated_at timestamp with time zone null default now(),
   constraint bookings_pkey primary key (id)
);

-- Create the index for improved query performance
CREATE INDEX IF NOT EXISTS bookings_created_at_idx on public.bookings using btree (created_at desc);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for the booking form
-- This allows anonymous users to insert new bookings
CREATE POLICY IF NOT EXISTS "Anyone can create bookings" 
ON public.bookings
FOR INSERT 
TO anon
WITH CHECK (true);

-- This allows anonymous users to read bookings (for displaying booking status)
CREATE POLICY IF NOT EXISTS "Anyone can read bookings" 
ON public.bookings
FOR SELECT
TO anon
USING (true);

-- Insert a test record to verify everything is working
-- Uncomment and run this if you want to add a test record
/*
INSERT INTO public.bookings (
  name, 
  contact, 
  address, 
  category, 
  model, 
  price_per_day, 
  status
)
VALUES (
  'Test User', 
  '9876543210', 
  'Test Address', 
  'Test Category', 
  'Test Model', 
  500, 
  'test'
);
*/

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' 
  AND table_name = 'bookings'
ORDER BY 
  ordinal_position;

-- Check for existing records
-- SELECT * FROM public.bookings LIMIT 5;
