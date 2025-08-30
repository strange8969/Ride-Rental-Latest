-- Add days and total_price columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS days INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2) DEFAULT 0;

-- Update existing records to set default values
UPDATE bookings SET days = 1 WHERE days IS NULL;
UPDATE bookings SET total_price = price_per_day * days WHERE total_price IS NULL;

-- Make days a required field
ALTER TABLE bookings ALTER COLUMN days SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN total_price SET NOT NULL;

-- Add a check constraint to ensure days is positive and reasonable
ALTER TABLE bookings ADD CONSTRAINT bookings_days_check CHECK (days > 0 AND days <= 30);
