-- BOOKINGS TABLE SETUP
-- Copy this entire file and run it in your Supabase SQL Editor

-- First, drop the existing table if it exists
DROP TABLE IF EXISTS public.bookings;

-- Create the bookings table with your specified structure
CREATE TABLE public.bookings (
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

-- Create the index
CREATE INDEX IF NOT EXISTS bookings_created_at_idx on public.bookings using btree (created_at desc);

-- IMPORTANT: Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow your application to read and write data
CREATE POLICY "Anyone can create bookings" 
ON public.bookings
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can read bookings" 
ON public.bookings
FOR SELECT
TO anon
USING (true);

-- Insert a test record to verify everything works
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

-- Verify the record was inserted
SELECT * FROM public.bookings;
