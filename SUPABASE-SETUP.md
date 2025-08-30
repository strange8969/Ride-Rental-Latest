# How to Fix Supabase Connection Issues

If your bookings are not being saved to the database, follow these steps to troubleshoot:

## 1. Set up your Supabase credentials

The app needs two environment variables to connect to Supabase:

1. Open the `.env` file in the project root
2. Replace the placeholders with your actual Supabase credentials:

```
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

You can find these values in your Supabase dashboard:
- Go to https://app.supabase.com/
- Select your project
- Go to Project Settings → API
- Copy the "Project URL" and "anon/public" key

## 2. Restart the development server

After updating the .env file, restart the development server:

```
npm run dev
```

## 3. Check the diagnostics

The app now includes a diagnostics panel that appears at the bottom right of the screen in development mode. This will tell you if the Supabase connection is working.

## 4. Multiple fallbacks implemented

The app now has multiple fallback mechanisms:

1. First tries to save to Supabase
2. If that fails, tries to use Google Forms
3. If both fail, saves to browser localStorage

Even if Supabase is not working, your bookings will be saved somewhere and can be retrieved later.

## 5. Database migration

Make sure the database schema includes the required fields:

- days
- total_price

You can run the migration script in `supabase/migrations/20250822000001_add_days_to_bookings.sql` to add these fields.
