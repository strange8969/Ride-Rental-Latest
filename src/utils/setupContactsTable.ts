import { supabase } from '../lib/supabase';

/**
 * This script creates a "contacts" table in Supabase if it doesn't exist.
 * Run this script once to set up your contacts table.
 */
export async function setupContactsTable() {
  try {
    // Check if we can query the contacts table
    const { error: checkError } = await supabase
      .from('contacts')
      .select('count')
      .limit(1);
    
    // If we got a "relation does not exist" error, we need to create the table
    if (checkError && checkError.message.includes('relation "contacts" does not exist')) {
      // Create the contacts table using SQL
      const { error: createError } = await supabase.rpc('create_contacts_table');
      
      if (createError) {
        console.error('Failed to create contacts table:', createError);
        return false;
      }
      
      console.log('Contacts table created successfully!');
      return true;
    } else if (checkError) {
      console.error('Error checking for contacts table:', checkError);
      return false;
    } else {
      console.log('Contacts table already exists.');
      return true;
    }
  } catch (err) {
    console.error('Unexpected error setting up contacts table:', err);
    return false;
  }
}
