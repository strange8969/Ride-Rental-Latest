# Connect to the correct Supabase project and test the connection

Write-Host "`n===== Supabase Project Connection =====`n" -ForegroundColor Cyan
Write-Host "This script will help you connect to your specific Supabase project."
Write-Host "Project ID: tybqzpwhefxrcfcsqqef"

# Display current configuration
Write-Host "`nCurrent configuration:" -ForegroundColor Yellow
$envContent = Get-Content -Path .env -ErrorAction SilentlyContinue
if ($envContent) {
    $supabaseUrl = ($envContent | Where-Object { $_ -match "VITE_SUPABASE_URL=" }) -replace "VITE_SUPABASE_URL=", ""
    $hasKey = ($envContent | Where-Object { $_ -match "VITE_SUPABASE_ANON_KEY=" })
    
    Write-Host "URL: $supabaseUrl"
    Write-Host "API Key: $(if ($hasKey) { "Set (hidden for security)" } else { "Not set" })"
} else {
    Write-Host "No .env file found" -ForegroundColor Red
}

# Ask if user wants to update configuration
$updateConfig = Read-Host "`nDo you want to update the configuration? (y/n)"
if ($updateConfig -eq "y") {
    # Provide the correct URL
    $url = "https://tybqzpwhefxrcfcsqqef.supabase.co"
    
    # Ask for the API key
    Write-Host "`nGo to your Supabase dashboard:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/tybqzpwhefxrcfcsqqef/settings/api"
    Write-Host "Copy the 'anon' public API key"
    $apiKey = Read-Host "`nPaste your anon API key here"
    
    if ($apiKey) {
        # Create or update .env file
        $newEnvContent = @"
# Supabase Configuration
# Updated on $(Get-Date)

# The URL to your Supabase project
VITE_SUPABASE_URL=$url

# The anon/public key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=$apiKey
"@
        Set-Content -Path .env -Value $newEnvContent
        
        Write-Host "`n✅ Configuration updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "`nNo API key provided. Configuration not updated." -ForegroundColor Red
    }
}

# Ask if user wants to restart the dev server
$restartServer = Read-Host "`nDo you want to restart the development server? (y/n)"
if ($restartServer -eq "y") {
    Write-Host "`nStopping any running Node.js processes..." -ForegroundColor Yellow
    taskkill /f /im node.exe 2>$null
    
    Write-Host "`nStarting development server..." -ForegroundColor Yellow
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
}

# Open the setup page
$openSetup = Read-Host "`nOpen the setup page in browser? (y/n)"
if ($openSetup -eq "y") {
    Start-Process "http://localhost:5173/setup-supabase"
}

Write-Host "`nDone!" -ForegroundColor Cyan
