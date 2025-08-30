# Connecting to Your Specific Supabase Project

This guide will help you set up the connection to your specific Supabase project with ID: `tybqzpwhefxrcfcsqqef`.

## Your Supabase Project Details

- **Project ID:** tybqzpwhefxrcfcsqqef
- **Project URL:** https://tybqzpwhefxrcfcsqqef.supabase.co
- **Project Dashboard:** [https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef](https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef)
- **SQL Editor Link:** [https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/editor](https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/editor)

## Step 1: Verify Your API Key

1. Go to your Supabase dashboard: [Project Settings > API](https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/settings/api)
2. Find the section titled "Project API keys"
3. Copy the "anon" public key (not the service_role key)
4. This key should look like a long JWT token

## Step 2: Update Your Environment Variables

Make sure your `.env` file in the project root has the following configuration:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://tybqzpwhefxrcfcsqqef.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-dashboard
```

You can either:
- Edit the `.env` file manually
- Run the `connect-to-project.ps1` script to guide you through the process

## Step 3: Set Up the Database Table

You need to create the bookings table in your Supabase project:

1. Go to the [SQL Editor](https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/editor)
2. Create a new query
3. Copy and paste the contents of `supabase/setup-project-table.sql`
4. Run the query

Alternatively:
- Go to [Table Editor](https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/editor) 
- Click "Create a new table"
- Name it "bookings"
- Add the following columns:
  - id (uuid, primary key, default: gen_random_uuid())
  - name (text, not null)
  - contact (text, not null)
  - address (text, not null)
  - category (text, not null)
  - model (text, not null)
  - price_per_day (integer, not null)
  - status (text, default: 'pending')
  - created_at (timestamptz, default: now())
  - updated_at (timestamptz, default: now())

## Step 4: Set Up Row Level Security (RLS)

For your booking system to work, you need to set up RLS policies:

1. Go to [Authentication > Policies](https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/auth/policies)
2. Find the "bookings" table
3. Add two policies:
   
   **Policy 1: Allow Anonymous Inserts**
   - Name: "Anyone can create bookings"
   - Operation: INSERT
   - Target roles: authenticated, anon
   - Using expression: true
   
   **Policy 2: Allow Anonymous Reads**
   - Name: "Anyone can read bookings"
   - Operation: SELECT
   - Target roles: authenticated, anon
   - Using expression: true

## Step 5: Verify Your Connection

1. Start your development server (if not already running): `npm run dev`
2. Navigate to: http://localhost:5173/setup-supabase
3. Check if the connection status shows "Connected"
4. Try creating a test booking to verify the full functionality

## Troubleshooting

If you're still experiencing connection issues:

1. **Check your API key**: Make sure it's the complete anon key from your dashboard
2. **Check RLS policies**: Without proper policies, API requests will fail
3. **Restart your server**: After updating your .env file, restart the development server
4. **Check your network**: Ensure there are no firewall or network restrictions

## Quick Commands

- Run `connect-to-project.ps1` to set up your connection
- Use `npm run dev` to start your development server

Need help? Refer to the [Supabase documentation](https://supabase.com/docs) or open an issue in your project repository.
