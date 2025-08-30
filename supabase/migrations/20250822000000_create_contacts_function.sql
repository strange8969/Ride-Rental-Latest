-- Function to create the contacts table if it doesn't exist
CREATE OR REPLACE FUNCTION create_contacts_table_if_not_exists()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the contacts table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'contacts'
  ) THEN
    -- Create the contacts table
    CREATE TABLE contacts (
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
    CREATE POLICY "Anyone can create contacts"
      ON contacts
      FOR INSERT
      TO anon
      WITH CHECK (true);
      
    CREATE POLICY "Anyone can read contacts"
      ON contacts
      FOR SELECT
      TO anon
      USING (true);
    
    -- Create index
    CREATE INDEX contacts_created_at_idx ON contacts(created_at DESC);
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating contacts table: %', SQLERRM;
    RETURN false;
END;
$$;
