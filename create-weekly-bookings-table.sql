-- Create weekly_bookings table
CREATE TABLE IF NOT EXISTS public.weekly_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL,
    model TEXT NOT NULL,
    price_per_day INTEGER NOT NULL,
    weeks INTEGER NOT NULL DEFAULT 1,
    total_weeks_price INTEGER NOT NULL,
    weekly_discount_percent INTEGER DEFAULT 35,
    original_price INTEGER NOT NULL,
    savings INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    pickup_date DATE,
    return_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.weekly_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on weekly_bookings" ON public.weekly_bookings
FOR ALL USING (true) WITH CHECK (true);

-- Create an index on created_at for better query performance
CREATE INDEX idx_weekly_bookings_created_at ON public.weekly_bookings(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX idx_weekly_bookings_status ON public.weekly_bookings(status);
