@echo off
echo.
echo ===== Supabase Configuration Setup =====
echo.
echo This script will help you configure your Supabase credentials.
echo You can find these in your Supabase dashboard under Project Settings ^> API.
echo.

set /p supabase_url="Enter your Supabase Project URL (https://your-project-id.supabase.co): "
set /p supabase_key="Enter your Supabase anon/public key: "

echo.
echo Creating .env file with your credentials...

echo # Supabase Configuration > .env
echo # Updated on %date% %time% >> .env
echo. >> .env
echo # The URL to your Supabase project >> .env
echo VITE_SUPABASE_URL=%supabase_url% >> .env
echo. >> .env
echo # The anon/public key (safe to use in browser) >> .env
echo VITE_SUPABASE_ANON_KEY=%supabase_key% >> .env

echo.
echo ✅ Supabase configuration has been updated successfully!
echo.
echo Next steps:
echo 1. Restart your development server (npm run dev)
echo 2. Check the Supabase Status panel to confirm connection
echo.

pause
