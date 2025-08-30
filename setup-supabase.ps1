# Supabase Configuration Setup Script

Write-Host "`n===== Supabase Configuration Setup =====`n" -ForegroundColor Cyan
Write-Host "This script will help you configure your Supabase credentials."
Write-Host "You can find these in your Supabase dashboard under Project Settings > API.`n"

$supabaseUrl = Read-Host "Enter your Supabase Project URL (https://your-project-id.supabase.co)"
$supabaseKey = Read-Host "Enter your Supabase anon/public key"

Write-Host "`nValidating credentials..." -ForegroundColor Yellow

$isValid = $true
$errorMessages = @()

if (-not $supabaseUrl) {
    $isValid = $false
    $errorMessages += "- Supabase URL is required"
} elseif (-not $supabaseUrl.StartsWith("https://") -or -not $supabaseUrl.Contains("supabase.co")) {
    $isValid = $false
    $errorMessages += "- Supabase URL should be in the format https://your-project-id.supabase.co"
}

if (-not $supabaseKey) {
    $isValid = $false
    $errorMessages += "- Supabase anon key is required"
} elseif ($supabaseKey.Length -lt 20) {
    $isValid = $false
    $errorMessages += "- Supabase anon key appears to be too short (should be a long string)"
}

if (-not $isValid) {
    Write-Host "`n❌ Invalid credentials:" -ForegroundColor Red
    foreach ($error in $errorMessages) {
        Write-Host $error -ForegroundColor Red
    }
    Write-Host "`nPlease run this script again with valid credentials."
} else {
    Write-Host "`nCreating .env file with your credentials..." -ForegroundColor Yellow

    $envContent = @"
# Supabase Configuration
# Updated on $(Get-Date)

# The URL to your Supabase project
VITE_SUPABASE_URL=$supabaseUrl

# The anon/public key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=$supabaseKey
"@

    try {
        Set-Content -Path .\.env -Value $envContent -Force
        Write-Host "`n✅ Supabase configuration has been updated successfully!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Cyan
        Write-Host "1. Restart your development server (npm run dev)"
        Write-Host "2. Check the Supabase Status panel to confirm connection"
    } catch {
        Write-Host "`n❌ Failed to update Supabase configuration." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "`nPlease manually edit your .env file with the following values:"
        Write-Host "VITE_SUPABASE_URL=$supabaseUrl"
        Write-Host "VITE_SUPABASE_ANON_KEY=$supabaseKey"
    }
}

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
