@echo off
cls
echo ======================================================
echo   SUPABASE CONNECTION FIXER
echo   Fix connection issues between your app and Supabase
echo ======================================================
echo.

:: Check for existing .env file
if exist .env (
    echo Found existing .env file
    type .env | findstr "VITE_SUPABASE_URL" > nul
    if not errorlevel 1 (
        for /f "tokens=2 delims==" %%a in ('type .env ^| findstr "VITE_SUPABASE_URL"') do (
            set current_url=%%a
            echo Current URL: %%a
        )
    )
    
    type .env | findstr "VITE_SUPABASE_ANON_KEY" > nul
    if not errorlevel 1 (
        echo Current Key: [Hidden for security]
    )
)

:: Ask for Supabase URL
echo.
echo Enter your Supabase project URL:
if defined current_url (
    echo [Press Enter to keep current: %current_url%]
)
set /p url=

if "%url%"=="" (
    if defined current_url (
        set url=%current_url%
        echo Using existing URL: %url%
    )
)

:: Basic URL validation
echo %url% | findstr /r "^https://" > nul
if errorlevel 1 (
    echo.
    echo ERROR: Invalid URL format. URL should start with https://
    echo Example: https://your-project-ref.supabase.co
    pause
    exit /b 1
)

:: Ask for Supabase Anon Key
echo.
echo Enter your Supabase anon/public key:
if exist .env (
    echo [Press Enter to keep current key]
)
set /p key=

if "%key%"=="" (
    if exist .env (
        for /f "tokens=2 delims==" %%a in ('type .env ^| findstr "VITE_SUPABASE_ANON_KEY"') do (
            set key=%%a
            echo Using existing key (masked for security)
        )
    )
)

:: Basic key validation
echo %key% | findstr /r "^eyJ" > nul
if errorlevel 1 (
    echo.
    echo WARNING: Key does not appear to be in valid JWT format (eyJ...)
    echo It should look like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    echo.
    set /p confirm=Continue anyway? (y/N): 
    if /i not "%confirm%"=="y" (
        echo.
        echo Operation cancelled. No changes were made.
        pause
        exit /b 1
    )
)

:: Create or update .env file
echo.
echo Updating .env file with new configuration...

echo # Supabase Configuration > .env
echo # Updated on %date% >> .env
echo. >> .env
echo # The URL to your Supabase project >> .env
echo VITE_SUPABASE_URL=%url% >> .env
echo. >> .env
echo # The anon/public key (safe to use in browser) >> .env
echo VITE_SUPABASE_ANON_KEY=%key% >> .env

echo.
echo SUCCESS: .env file updated successfully!
echo.
echo NOTE: You need to restart your development server for changes to take effect.
echo To test your Supabase connection, go to: http://localhost:3000/fix-supabase
echo.
echo =======================================================
echo To troubleshoot connection issues, visit your Supabase dashboard:
echo https://supabase.com/dashboard
echo =======================================================
echo.

pause
