# 🔧 Supabase Booking Issue Fix Guide

## Issue Analysis
You're not receiving booking data in Supabase. This is typically caused by one of these issues:

### 1. Database Schema Mismatch
**MOST LIKELY CAUSE**: Your `bookings` table is missing required columns.

**Fix**: Run this SQL in your Supabase SQL Editor:

```sql
-- ADD MISSING COLUMNS TO BOOKINGS TABLE
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS days integer,
ADD COLUMN IF NOT EXISTS total_price integer,
ADD COLUMN IF NOT EXISTS rental_type text DEFAULT 'daily';

-- Update existing records with default values
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
```

### 2. Weekly Bookings Table Missing
**For weekly bookings**: You need to create the `weekly_bookings` table.

**Fix**: Run this SQL in your Supabase SQL Editor:

```sql
-- CREATE WEEKLY BOOKINGS TABLE
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

-- Create policy to allow operations
CREATE POLICY "Allow all operations on weekly_bookings" ON public.weekly_bookings
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_weekly_bookings_created_at ON public.weekly_bookings(created_at DESC);
CREATE INDEX idx_weekly_bookings_status ON public.weekly_bookings(status);
```

### 3. Environment Variables
Verify your `.env` file has correct values:

```env
VITE_SUPABASE_URL=https://tybqzpwhefxrcfcsqqef.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Row Level Security Policies
Ensure your table has proper RLS policies:

```sql
-- For bookings table
CREATE POLICY "Anyone can create bookings" 
ON public.bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can read bookings" 
ON public.bookings FOR SELECT TO anon USING (true);

-- For weekly_bookings table
CREATE POLICY "Anyone can create weekly bookings" 
ON public.weekly_bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can read weekly bookings" 
ON public.weekly_bookings FOR SELECT TO anon USING (true);
```

## How to Debug

### Step 1: Test Connection
1. Go to `/test` page in your app
2. Click "Test Connection & Insert"
3. Check browser console for detailed error messages

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Try submitting a booking
4. Look for detailed error messages

### Step 3: Check Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Check if `bookings` table exists
4. Verify table structure matches expected columns

### Step 4: Test Real Booking
1. Go to any vehicle page
2. Click "Book Now"
3. Fill form and submit
4. Check console for error details
5. Check Supabase dashboard for new entries

## Common Error Messages

### "column does not exist"
- **Cause**: Missing columns in database table
- **Fix**: Run the schema update SQL above

### "relation does not exist"
- **Cause**: Table doesn't exist
- **Fix**: Create the table using setup SQL

### "authentication required"
- **Cause**: Wrong API key or RLS policies
- **Fix**: Check environment variables and RLS policies

### "permission denied"
- **Cause**: RLS policies too restrictive
- **Fix**: Update RLS policies to allow inserts

## Files to Check
1. `fix-bookings-table-schema.sql` - Database schema fix
2. `create-weekly-bookings-table.sql` - Weekly bookings table
3. `.env` - Environment variables
4. Browser console - Error messages

## Next Steps
1. Run the SQL fixes above
2. Test using the diagnostic tools at `/test`
3. Try a real booking and check console
4. Verify data appears in Supabase dashboard

The improved error handling will now show detailed error messages in the console and alert boxes to help identify the exact issue.
