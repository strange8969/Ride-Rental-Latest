-- Create Contacts table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  vehicle text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable row level security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contacts (for the public contact form)
CREATE POLICY "Anyone can create contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading contacts (for admin purposes)
CREATE POLICY "Anyone can read contacts"
  ON contacts
  FOR SELECT
  TO anon
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at DESC);
