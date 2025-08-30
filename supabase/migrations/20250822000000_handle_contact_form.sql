-- Function to handle contact form submissions
-- This function will:
-- 1. Create the contacts table if it doesn't exist
-- 2. Insert the form data into the table
-- 3. Return success/error

CREATE OR REPLACE FUNCTION handle_contact_form(
  form_name TEXT,
  form_email TEXT,
  form_phone TEXT,
  form_vehicle TEXT,
  form_message TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- First create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Enable Row Level Security if not already enabled
  BEGIN
    ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
  EXCEPTION
    WHEN OTHERS THEN
      -- RLS may already be enabled, continue
  END;

  -- Create policies if they don't exist
  -- Check if the insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Anyone can create contacts'
  ) THEN
    CREATE POLICY "Anyone can create contacts"
      ON contacts
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  -- Check if the select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Anyone can read contacts'
  ) THEN
    CREATE POLICY "Anyone can read contacts"
      ON contacts
      FOR SELECT
      TO anon
      USING (true);
  END IF;

  -- Insert the contact form data
  INSERT INTO contacts (name, email, phone, vehicle, message)
  VALUES (form_name, form_email, form_phone, form_vehicle, form_message);

  -- Return success
  result := jsonb_build_object(
    'success', true,
    'message', 'Contact form submitted successfully'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error information
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
    
    RETURN result;
END;
$$;
