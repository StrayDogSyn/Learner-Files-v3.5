# Simple Emergency System Test
Write-Host "Testing Emergency Deployment System..." -ForegroundColor Cyan

# Test 1: Check if emergency-deploy.ps1 exists
if (Test-Path ".trae\emergency-deploy.ps1") {
    Write-Host "Emergency deployment script found" -ForegroundColor Green
} else {
    Write-Host "Emergency deployment script missing" -ForegroundColor Red
    exit 1
}

# Test 2: Check emergency configuration files
$files = @(".trae\claude-solo-emergency-layout.yml", ".trae\claude-solo-asset-recovery.yml")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Found: $file" -ForegroundColor Green
    } else {
        Write-Host "Missing: $file" -ForegroundColor Yellow
    }
}

# Test 3: Check emergency function
$content = Get-Content ".trae\emergency-deploy.ps1" -Raw -ErrorAction SilentlyContinue
if ($content -and $content.Contains("Start-EmergencyDeployment")) {
    Write-Host "Emergency deployment function found" -ForegroundColor Green
} else {
    Write-Host "Emergency deployment function missing" -ForegroundColor Red
}

Write-Host "Emergency system test completed" -ForegroundColor Cyan