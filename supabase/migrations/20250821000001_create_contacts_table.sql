-- Create contacts table for the contact form
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public inserts to contacts" 
  ON contacts 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow public reads from contacts" 
  ON contacts 
  FOR SELECT 
  TO anon 
  USING (true);
