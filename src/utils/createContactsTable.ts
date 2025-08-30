import { supabase } from '../lib/supabase';

/**
 * This function executes raw SQL to create the contacts table
 * We'll call it from our ContactPage component when it loads
 */
export async function createContactsTable() {
  try {
    // First, check if the table exists
    const { error: checkError } = await supabase
      .from('contacts')
      .select('count')
      .limit(1)
      .single();
      
    if (checkError && checkError.code === 'PGRST116') {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc(
        'exec_sql',
        {
          sql_statement: `
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
            CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at DESC);
          `
        }
      );
      
      if (createError) {
        console.error('Error creating contacts table:', createError);
        return { success: false, error: createError };
      }
      
      return { success: true, message: 'Contacts table created' };
    } else if (checkError) {
      console.error('Error checking for contacts table:', checkError);
      return { success: false, error: checkError };
    }
    
    return { success: true, message: 'Contacts table already exists' };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
}
