# Fixing Supabase Connectivity Issues

This guide will help you fix the Supabase connection issues in your Ride Rental project.

## Step 1: Access the Setup Page

1. Start your development server with `npm run dev`
2. Navigate to the setup page at: http://localhost:5174/setup-supabase

## Step 2: Update Your Environment Variables

Make sure your `.env` file has the correct Supabase URL and anon key:

```properties
# Supabase Configuration
VITE_SUPABASE_URL=https://tybqzpwhefxrcfcsqqef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YnF6cHdoZWZ4cmNmY3NxcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI3MzkzMTgsImV4cCI6MjAwODMxNTMxOH0.ptMyXUy1B_8zEQILGwpBgVi_qGYrTMJaFxzYTXK5QTk
```

**Note**: After updating the `.env` file, restart your development server.

## Step 3: Create the Bookings Table

1. On the setup page, click the "Create Bookings Table" button
2. This will create the bookings table in your Supabase project with the correct structure
3. Check the response to see if it was successful

## Step 4: Test Your Connection

The setup page includes a Supabase Test Component that will:
- Check if your environment variables are correctly configured
- Test the connection to your Supabase project
- Display data from your bookings table (if available)
- Allow you to insert test records

## Step 5: Apply Migrations

If the above steps don't work, you might need to apply the migrations directly in the Supabase SQL Editor:

1. Log in to your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the SQL from this file:
   ```
   supabase/migrations/20250822000004_recreate_bookings_table.sql
   ```
4. Run the SQL commands to create the table structure

## Step 6: Check Row Level Security Policies

If you can connect but can't insert data, you might have Row Level Security (RLS) issues:

1. In your Supabase dashboard, go to "Authentication" > "Policies"
2. Make sure you have policies that allow public access for inserts and selects
3. If not, apply these policies:

```sql
-- Allow inserting bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow reading bookings
CREATE POLICY "Anyone can read bookings" 
ON public.bookings
FOR SELECT
TO anon
USING (true);
```

## Troubleshooting Common Issues

### "Table doesn't exist" error

- Make sure you've created the bookings table (Step 3)
- Check if you're connected to the right Supabase project

### "RLS policy violation" error

- Make sure you have the correct policies (Step 6)
- Verify your anonymous key has the right permissions

### "JWT error" or authentication issues

- Double-check your anon key in the `.env` file
- Make sure you're using the public/anon key, not the secret key

### "Network error" or "Connection failed"

- Check your internet connection
- Make sure your Supabase project is active and running

## Need More Help?

If you're still experiencing issues:

1. Check the browser console for more detailed error messages
2. Look at the debug information in the Setup Page
3. Try recreating the table with the SQL in the migrations file

Remember to restart your development server after changing environment variables!
