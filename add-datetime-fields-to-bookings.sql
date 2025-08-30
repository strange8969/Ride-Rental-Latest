-- Add pickup and return date/time fields to bookings table for daily booking scheduling

-- Add date and time columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS pickup_date DATE,
ADD COLUMN IF NOT EXISTS return_date DATE,
ADD COLUMN IF NOT EXISTS pickup_time TIME,
ADD COLUMN IF NOT EXISTS return_time TIME;

-- Add comments for documentation
COMMENT ON COLUMN public.bookings.pickup_date IS 'Scheduled pickup date for the rental';
COMMENT ON COLUMN public.bookings.return_date IS 'Scheduled return date for the rental';
COMMENT ON COLUMN public.bookings.pickup_time IS 'Scheduled pickup time for the rental';
COMMENT ON COLUMN public.bookings.return_time IS 'Scheduled return time for the rental';

-- Update Row Level Security policy to include new columns
DROP POLICY IF EXISTS "Allow viewing all bookings" ON public.bookings;
CREATE POLICY "Allow viewing all bookings" ON public.bookings
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow inserting bookings" ON public.bookings;
CREATE POLICY "Allow inserting bookings" ON public.bookings
FOR INSERT WITH CHECK (true);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND table_schema = 'public'
ORDER BY ordinal_position;
