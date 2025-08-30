# How to Fix "Failed to fetch" Supabase Error

Follow these steps to fix your Supabase connection issue:

## 1. Get Your Supabase Credentials

1. Go to the [Supabase dashboard](https://app.supabase.com/) and sign in
2. Select your project
3. Navigate to "Project Settings" in the left sidebar
4. Click on "API" in the settings menu
5. You'll find two important pieces of information:
   - **Project URL**: This is your `VITE_SUPABASE_URL` value
   - **API Keys** > **anon public**: This is your `VITE_SUPABASE_ANON_KEY` value

## 2. Update Your .env File

Edit the `.env` file in your project root and replace the placeholders:

```
# The URL to your Supabase project (replace with your actual URL)
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co

# The anon/public key (replace with your actual key)
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 3. Restart the Development Server

After updating your environment variables, restart the development server:

```
# Stop any running instances first
taskkill /f /im node.exe

# Then start the server
npm run dev
```

## 4. Check the Connection

After restarting, the Supabase Status checker should show "Connected" if everything is working correctly.

## Common Issues

1. **Make sure there are no spaces around the equals sign** in your .env file
2. **Check for typos** in your project URL and anon key
3. **Make sure your project exists** and is active in Supabase
4. **Ensure your IP address isn't blocked** by Supabase
5. **Try incognito mode** or a different browser to rule out browser extension issues

## Creating a New Supabase Project (if needed)

If you don't have a Supabase project set up:

1. Go to [app.supabase.com](https://app.supabase.com/) and sign up/in
2. Click "New Project"
3. Fill out the project details and create a new project
4. Once created, follow the steps above to get your credentials
5. You'll also need to set up the required tables - run the migration scripts from your project's `supabase/migrations/` folder
