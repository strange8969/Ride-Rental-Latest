# Supabase Connection Troubleshooting

This guide will help you fix connection issues between your application and Supabase.

## Quick Fix Steps

1. **Run the helper script**:
   ```powershell
   # On Windows
   .\fix-supabase-connection.ps1
   ```

2. **Visit the test page**: 
   After running the script, navigate to http://localhost:3000/fix-supabase to test the connection.

3. **Restart your development server** after making any changes to your .env file.

## Common Issues and Solutions

### 1. Invalid API Key Error

If you're seeing "Invalid API key" or "JWT malformed" errors:

- Ensure you're using the correct `anon` key from your Supabase project settings
- The key should be in JWT format starting with `eyJ...`
- Don't include any quotes around the key in your .env file

### 2. Incorrect URL Format

The Supabase URL should:

- Start with `https://`
- Include your project reference ID
- End with `.supabase.co`
- Example: `https://abcdefghijklm.supabase.co`

### 3. Missing Tables

If authentication works but you're getting errors about missing tables:

- Make sure the `bookings` table exists in your Supabase database
- Check that you've run all necessary migrations
- Verify that table names and column names match exactly what's expected

### 4. Row Level Security (RLS) Issues

If you can't insert or select data:

- Check that you have the appropriate RLS policies set up
- For anonymous inserts, you need a policy that allows `FOR INSERT TO anon WITH CHECK (true)`
- For reading data, you need a policy that allows `FOR SELECT TO anon USING (true)`

### 5. Environment Variable Issues

- Make sure there are no spaces around the `=` sign in your .env file
- No quotes should be around values in the .env file
- Always restart your development server after changing environment variables

## Using the Supabase Connection Fixer Tool

Our application includes a special page to help diagnose and fix Supabase connection issues:

1. Go to: http://localhost:3000/fix-supabase
2. This page will:
   - Test your current connection
   - Validate your API key format
   - Let you test custom credentials
   - Generate correct .env file content for you

## Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project
3. Navigate to Project Settings → API
4. Under "Project API keys", copy the `anon` public key (NOT the secret key)
5. The Project URL is listed at the top of the API page

## Need More Help?

If you continue to have issues, please check:

- [Supabase Documentation](https://supabase.com/docs)
- The app's status checker at the bottom right corner in development mode
- Ask for help in the project's support channel
