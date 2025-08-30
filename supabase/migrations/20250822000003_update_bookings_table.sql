-- Updated Bookings table structure based on user requirements
-- First drop the existing table (if you want to completely replace it)
-- DROP TABLE IF EXISTS public.bookings;

-- Create table with the user's definition
CREATE TABLE IF NOT EXISTS public.bookings (
   id uuid not null default gen_random_uuid(),
   name text not null,
   contact text not null,
   address text not null,
   category text not null,
   model text not null,
   price_per_day integer not null, -- Changed from numeric to integer
   status text null default 'pending'::text,
   created_at timestamp with time zone null default now(),
   updated_at timestamp with time zone null default now(),
   constraint bookings_pkey primary key (id)
) TABLESPACE pg_default;

-- Add or recreate the index
CREATE INDEX IF NOT EXISTS bookings_created_at_idx on public.bookings using btree (created_at desc) TABLESPACE pg_default;

-- Note: We're keeping the existing days and total_price columns and their constraints
-- If you want to remove them, uncomment these lines:
-- ALTER TABLE public.bookings DROP COLUMN IF EXISTS days;
-- ALTER TABLE public.bookings DROP COLUMN IF EXISTS total_price;

-- Also, we're preserving the existing RLS policies
-- If you want to remove them, you would need to explicitly drop them
