/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text, customer name)
      - `contact` (text, phone number)
      - `address` (text, pickup address)
      - `category` (text, vehicle category)
      - `model` (text, vehicle model)
      - `price_per_day` (integer, daily rental price)
      - `status` (text, booking status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public insert (since no auth required for booking)
    - Add policy for reading bookings (for admin purposes)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  address text NOT NULL,
  category text NOT NULL,
  model text NOT NULL,
  price_per_day integer NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (for public booking form)
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading bookings (for admin dashboard - you can restrict this later)
CREATE POLICY "Anyone can read bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);