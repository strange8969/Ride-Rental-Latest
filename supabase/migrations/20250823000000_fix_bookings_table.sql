-- Drop existing bookings table if it exists
DROP TABLE IF EXISTS bookings;

-- Recreate the bookings table with the proper structure
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  price_per_day NUMERIC(10, 2) NOT NULL,
  days INTEGER DEFAULT 1,
  total_price NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable row level security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert bookings (for the public booking form)
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read bookings (for admin purposes and displaying in the interface)
CREATE POLICY "Anyone can read bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- Insert a test record to verify permissions
INSERT INTO bookings (name, contact, address, category, model, price_per_day, status)
VALUES ('Test User', '9876543210', 'Test Address', 'Test', 'Test Model', 100, 'test');
