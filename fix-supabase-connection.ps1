# Supabase Configuration Fixer Script
# This script helps fix Supabase connection issues by updating your .env file

# Function to validate URL
function Validate-Url {
    param (
        [string]$url
    )
    
    if (-not $url.StartsWith("https://")) {
        return $false
    }
    
    try {
        $uri = [System.Uri]::new($url)
        return $uri.Scheme -eq "https"
    } catch {
        return $false
    }
}

# Function to check if a string is a JWT token
function Test-JWTToken {
    param (
        [string]$token
    )
    
    if ($token -match '^eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*$') {
        return $true
    }
    return $false
}

# Clear screen
Clear-Host

Write-Host "====================================================="
Write-Host "  SUPABASE CONNECTION FIXER" -ForegroundColor Cyan
Write-Host "  Fix connection issues between your app and Supabase" -ForegroundColor Cyan
Write-Host "====================================================="
Write-Host ""

# Check for existing .env file
$envPath = ".env"
$envExists = Test-Path -Path $envPath
$currentUrl = ""
$currentKey = ""

if ($envExists) {
    Write-Host "Found existing .env file" -ForegroundColor Green
    $envContent = Get-Content -Path $envPath -Raw
    
    # Try to extract current values
    if ($envContent -match 'VITE_SUPABASE_URL=(.+?)(\r?\n|$)') {
        $currentUrl = $matches[1]
        Write-Host "Current URL: $currentUrl" -ForegroundColor Gray
    }
    
    if ($envContent -match 'VITE_SUPABASE_ANON_KEY=(.+?)(\r?\n|$)') {
        $currentKey = $matches[1]
        if ($currentKey.Length -gt 15) {
            $maskedKey = $currentKey.Substring(0, 10) + "..." + $currentKey.Substring($currentKey.Length - 5)
            Write-Host "Current Key: $maskedKey" -ForegroundColor Gray
        }
    }
}

# Ask for Supabase URL
Write-Host "`nEnter your Supabase project URL:" -ForegroundColor Yellow
if ($currentUrl) {
    Write-Host "[Press Enter to keep current: $currentUrl]" -ForegroundColor Gray
}
$url = Read-Host

if (-not $url -and $currentUrl) {
    $url = $currentUrl
    Write-Host "Using existing URL: $url" -ForegroundColor Blue
}

# Validate URL
$urlValid = Validate-Url -url $url
while (-not $urlValid) {
    Write-Host "Invalid URL. URL should be in the format 'https://your-project-ref.supabase.co'" -ForegroundColor Red
    $url = Read-Host "Please enter a valid Supabase URL"
    $urlValid = Validate-Url -url $url
}

# Ask for Supabase Anon Key
Write-Host "`nEnter your Supabase anon/public key:" -ForegroundColor Yellow
if ($currentKey) {
    Write-Host "[Press Enter to keep current key]" -ForegroundColor Gray
}
$key = Read-Host

if (-not $key -and $currentKey) {
    $key = $currentKey
    Write-Host "Using existing key (masked for security)" -ForegroundColor Blue
}

# Validate key (basic validation for JWT format)
if (-not (Test-JWTToken -token $key)) {
    Write-Host "`nWARNING: Key does not appear to be in valid JWT format (eyJ...)." -ForegroundColor Yellow
    Write-Host "It should look like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Operation cancelled. No changes were made." -ForegroundColor Red
        exit
    }
}

# Create or update .env file
Write-Host "`nUpdating .env file with new configuration..." -ForegroundColor Blue

$newEnvContent = @"
# Supabase Configuration
# Updated on $(Get-Date -Format "yyyy-MM-dd")

# The URL to your Supabase project
VITE_SUPABASE_URL=$url

# The anon/public key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=$key
"@

try {
    Set-Content -Path $envPath -Value $newEnvContent
    Write-Host "`nSUCCESS: .env file updated successfully!" -ForegroundColor Green
    
    Write-Host "`nNOTE: You need to restart your development server for changes to take effect." -ForegroundColor Yellow
    Write-Host "To test your Supabase connection, go to: http://localhost:3000/fix-supabase" -ForegroundColor Cyan
} catch {
    Write-Host "`nERROR: Failed to update .env file: $_" -ForegroundColor Red
}

Write-Host "`n====================================================="
Write-Host "To troubleshoot connection issues, visit your Supabase dashboard:"
Write-Host "https://supabase.com/dashboard/project/$url" -ForegroundColor Cyan
Write-Host "====================================================="
