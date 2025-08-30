-- Create a stored procedure to create the contacts table
CREATE OR REPLACE FUNCTION create_contacts_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the contacts table if it doesn't exist
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

  -- Create policies
  -- Allow anyone to insert into contacts table
  DROP POLICY IF EXISTS "Anyone can create contacts" ON contacts;
  CREATE POLICY "Anyone can create contacts"
    ON contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Allow anyone to read contacts (can restrict this later if needed)
  DROP POLICY IF EXISTS "Anyone can read contacts" ON contacts;
  CREATE POLICY "Anyone can read contacts"
    ON contacts
    FOR SELECT
    TO anon
    USING (true);

  -- Create index for better query performance
  CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at DESC);

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating contacts table: %', SQLERRM;
    RETURN false;
END;
$$;
