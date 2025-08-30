# Fixing the "Invalid API Key" Error in Your Supabase Connection

This guide will help you resolve the "Invalid API Key" error you're experiencing with your Supabase connection.

## Step 1: Get the Correct API Key

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings (gear icon in the left sidebar)
4. Click on "API" in the sidebar
5. Under "Project API keys", look for the "anon public" key (NOT the service_role key)
6. Copy this key - it should look like a long JWT token

## Step 2: Update Your .env File

1. Open your `.env` file in the project root
2. Update the values as follows:

```
# The URL to your Supabase project
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co

# The anon/public key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY-GOES-HERE
```

Make sure:
- The URL includes `https://` and ends with `.supabase.co`
- The anon key is the complete JWT token (should be quite long)
- There are no extra spaces or quotes around the values

## Step 3: Restart Your Development Server

After updating the `.env` file, you need to restart your development server:

1. Stop the current server (Ctrl+C)
2. Run `npm run dev` to start it again

## Step 4: Verify Connection

To verify your connection is working:

1. Go to http://localhost:5173/setup-supabase in your browser
2. Check if the connection status shows "Connected"
3. Try the test functionality to verify data access

## Common Issues and Solutions

### If your key is still not working:

1. **Key format issue**: Make sure you're copying the entire key. It should be a JWT token that looks like:
   `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YnF6cHdoZWZ4cmNmY3NxcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI3MzkzMTgsImV4cCI6MjAwODMxNTMxOH0.ptMyXUy1B_8zEQILGwpBgVi_qGYrTMJaFxzYTXK5QTk`

2. **Wrong key type**: Make sure you're using the "anon" key, not the "service_role" key

3. **Expired key**: If your key has expired, you'll need to regenerate it in your Supabase dashboard

### If the connection works but you can't insert data:

This is likely a Row Level Security (RLS) issue. You need to set up policies that allow anonymous users to insert data:

1. Go to your Supabase Dashboard
2. Go to the "Authentication" section
3. Click on "Policies"
4. Find your "bookings" table
5. Add a policy that allows anonymous inserts:
   - Policy name: "Anyone can create bookings"
   - Target roles: "anon"
   - Using expression: "true"

## Need More Help?

If you're still experiencing issues:
- Check your browser console for more detailed error messages
- Try the manual connection test on the setup page
- Make sure your Supabase project is active and not paused

You can also run the included `supabaseTest.js` file with Node.js for more diagnostics:
```
node supabaseTest.js
```
