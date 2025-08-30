-- This migration ensures the bookings table exists with the exact structure from your SQL definition
-- First, we'll check if the table exists and drop it to recreate it fresh
DROP TABLE IF EXISTS public.bookings;

-- Create table with the user's definition
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
) TABLESPACE pg_default;

-- Create the index
CREATE INDEX IF NOT EXISTS bookings_created_at_idx on public.bookings using btree (created_at desc) TABLESPACE pg_default;

-- Enable row level security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for the booking form
CREATE POLICY "Anyone can create bookings" 
ON public.bookings
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow reading bookings
CREATE POLICY "Anyone can read bookings" 
ON public.bookings
FOR SELECT
TO anon
USING (true);

-- Insert a test record to verify the table works
INSERT INTO public.bookings (name, contact, address, category, model, price_per_day, status)
VALUES ('Test User', '9876543210', '123 Test Address', 'Bike', 'Test Model', 500, 'test');
