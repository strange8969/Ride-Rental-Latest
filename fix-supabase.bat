@echo off
echo Supabase Connection Fix Helper
echo ============================
echo.

:menu
echo Choose an option:
echo 1. Check current Supabase configuration
echo 2. Update Supabase credentials
echo 3. Test Supabase connection
echo 4. Open Supabase dashboard
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto check_config
if "%choice%"=="2" goto update_credentials
if "%choice%"=="3" goto test_connection
if "%choice%"=="4" goto open_dashboard
if "%choice%"=="5" goto end

echo Invalid choice. Try again.
goto menu

:check_config
echo.
echo Checking current Supabase configuration...
echo.
type .env
echo.
pause
goto menu

:update_credentials
echo.
echo Update Supabase credentials
echo.
set /p url="Enter your Supabase URL (https://your-project-id.supabase.co): "
set /p key="Enter your Supabase anon key: "

echo # Supabase Configuration > .env
echo # Updated on %date% >> .env
echo. >> .env
echo # The URL to your Supabase project >> .env
echo VITE_SUPABASE_URL=%url% >> .env
echo. >> .env
echo # The anon/public key (safe to use in browser) >> .env
echo VITE_SUPABASE_ANON_KEY=%key% >> .env

echo.
echo Credentials updated! Remember to restart your development server.
echo.
pause
goto menu

:test_connection
echo.
echo Testing Supabase connection...
echo.
echo This will start the development server and open the setup page.
echo.
set /p continue="Continue? (y/n): "
if /i "%continue%"=="y" (
  start http://localhost:5173/setup-supabase
  npm run dev
)
goto menu

:open_dashboard
echo.
echo Opening Supabase dashboard...
start https://app.supabase.com
echo.
pause
goto menu

:end
echo Goodbye!
exit
