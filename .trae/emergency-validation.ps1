#!/usr/bin/env pwsh
# TRAE Emergency System Validation Script
# Validates all emergency response systems and configurations

param(
    [switch]$FullValidation = $false,
    [switch]$QuickCheck = $false,
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [string]$TestType = "all", # all, layout, assets, domains, monitoring
    [switch]$GenerateReport = $true
)

# Set error handling
$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# Global variables
$script:ValidationResults = @()
$script:StartTime = Get-Date
$script:ProjectRoot = Split-Path -Parent $PSScriptRoot
$script:EmergencyConfigPath = "$PSScriptRoot"

# Color functions for output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Header { param($Message) Write-Host "`n🔍 $Message" -ForegroundColor Magenta -BackgroundColor Black }

# Validation result tracking
function Add-ValidationResult {
    param(
        [string]$Category,
        [string]$Test,
        [string]$Status, # Pass, Fail, Warning, Skip
        [string]$Message,
        [string]$Details = ""
    )
    
    $script:ValidationResults += [PSCustomObject]@{
        Timestamp = Get-Date
        Category = $Category
        Test = $Test
        Status = $Status
        Message = $Message
        Details = $Details
    }
}

# Display banner
function Show-EmergencyValidationBanner {
    Clear-Host
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🚨 TRAE EMERGENCY SYSTEM VALIDATION 🚨                   ║
║                                                                              ║
║  Validating all emergency response systems and configurations               ║
║  Portfolio: straydogsyn.github.io/Learner-Files-v3.5                       ║
║  Multi-Domain: 4 domains + GitHub Pages                                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Red -BackgroundColor Black
    
    Write-Info "Validation Type: $TestType"
    Write-Info "Full Validation: $FullValidation"
    Write-Info "Dry Run Mode: $DryRun"
    Write-Info "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Host ""
}

# Check prerequisites
function Test-Prerequisites {
    Write-Header "VALIDATING PREREQUISITES"
    
    $prerequisites = @(
        @{ Name = "PowerShell"; Command = "pwsh --version"; MinVersion = "7.0" },
        @{ Name = "Node.js"; Command = "node --version"; MinVersion = "18.0" },
        @{ Name = "npm"; Command = "npm --version"; MinVersion = "8.0" },
        @{ Name = "Git"; Command = "git --version"; MinVersion = "2.0" }
    )
    
    foreach ($prereq in $prerequisites) {
        try {
            $version = Invoke-Expression $prereq.Command 2>$null
            if ($version) {
                Write-Success "$($prereq.Name): $version"
                Add-ValidationResult "Prerequisites" $prereq.Name "Pass" "Version: $version"
            } else {
                Write-Error "$($prereq.Name): Not found or not responding"
                Add-ValidationResult "Prerequisites" $prereq.Name "Fail" "Not found or not responding"
            }
        } catch {
            Write-Error "$($prereq.Name): Error checking version - $($_.Exception.Message)"
            Add-ValidationResult "Prerequisites" $prereq.Name "Fail" "Error: $($_.Exception.Message)"
        }
    }
}

# Validate emergency configuration files
function Test-EmergencyConfigurations {
    Write-Header "VALIDATING EMERGENCY CONFIGURATIONS"
    
    $configFiles = @(
        @{ Path = "$EmergencyConfigPath\claude-solo-emergency-layout.yml"; Type = "Layout Emergency" },
        @{ Path = "$EmergencyConfigPath\claude-solo-asset-recovery.yml"; Type = "Asset Recovery" },
        @{ Path = "$EmergencyConfigPath\claude-solo-multi-domain-orchestration.yml"; Type = "Multi-Domain" },
        @{ Path = "$EmergencyConfigPath\emergency-monitoring-dashboard.yml"; Type = "Monitoring Dashboard" },
        @{ Path = "$EmergencyConfigPath\emergency-deploy.ps1"; Type = "Deployment Script" },
        @{ Path = "$EmergencyConfigPath\emergency-response-playbook.md"; Type = "Response Playbook" },
        @{ Path = "$EmergencyConfigPath\package-claude-solo.json"; Type = "Package Configuration" },
        @{ Path = "$EmergencyConfigPath\README-claude-solo.md"; Type = "Documentation" }
    )
    
    foreach ($config in $configFiles) {
        if (Test-Path $config.Path) {
            $fileSize = (Get-Item $config.Path).Length
            Write-Success "$($config.Type): Found ($fileSize bytes)"
            Add-ValidationResult "Configuration" $config.Type "Pass" "File exists, size: $fileSize bytes"
            
            # Validate YAML syntax for .yml files
            if ($config.Path -like "*.yml") {
                try {
                    # Basic YAML validation (check for basic structure)
                    $content = Get-Content $config.Path -Raw
                    if ($content -match 'name:\s*".*"' -and $content -match 'agents:' -and $content -match 'prompt:') {
                        Write-Success "  └─ YAML structure valid"
                        Add-ValidationResult "Configuration" "$($config.Type) YAML" "Pass" "Valid YAML structure"
                    } else {
                        Write-Warning "  └─ YAML structure may be incomplete"
                        Add-ValidationResult "Configuration" "$($config.Type) YAML" "Warning" "YAML structure incomplete"
                    }
                } catch {
                    Write-Error "  └─ YAML validation error: $($_.Exception.Message)"
                    Add-ValidationResult "Configuration" "$($config.Type) YAML" "Fail" "YAML error: $($_.Exception.Message)"
                }
            }
        } else {
            Write-Error "$($config.Type): Missing file - $($config.Path)"
            Add-ValidationResult "Configuration" $config.Type "Fail" "Missing file: $($config.Path)"
        }
    }
}

# Test environment variables
function Test-EnvironmentVariables {
    Write-Header "VALIDATING ENVIRONMENT VARIABLES"
    
    # Check for .env files
    $envFiles = @(
        "$ProjectRoot\.env",
        "$ProjectRoot\.env.local",
        "$ProjectRoot\.env.claude-solo.example"
    )
    
    foreach ($envFile in $envFiles) {
        if (Test-Path $envFile) {
            Write-Success "Environment file found: $(Split-Path -Leaf $envFile)"
            Add-ValidationResult "Environment" "$(Split-Path -Leaf $envFile)" "Pass" "File exists"
        } else {
            Write-Warning "Environment file missing: $(Split-Path -Leaf $envFile)"
            Add-ValidationResult "Environment" "$(Split-Path -Leaf $envFile)" "Warning" "File missing"
        }
    }
    
    # Check critical environment variables
    $criticalVars = @(
        "ANTHROPIC_API_KEY",
        "GITHUB_TOKEN",
        "PORTFOLIO_BASE_URL",
        "VITE_MARVEL_PUBLIC_KEY"
    )
    
    foreach ($var in $criticalVars) {
        $value = [Environment]::GetEnvironmentVariable($var)
        if ($value -and $value -ne "your_key_here" -and $value -ne "placeholder") {
            Write-Success "${var}: Configured ($($value.Substring(0, [Math]::Min(8, $value.Length)))...)"
            Add-ValidationResult "Environment" $var "Pass" "Variable configured"
        } else {
            Write-Warning "${var}: Not configured or using placeholder"
            Add-ValidationResult "Environment" $var "Warning" "Not configured or placeholder"
        }
    }
}

# Test layout emergency system
function Test-LayoutEmergencySystem {
    Write-Header "VALIDATING LAYOUT EMERGENCY SYSTEM"
    
    # Test layout analysis capabilities
    try {
        Write-Info "Testing layout analysis configuration..."
        $layoutConfig = Get-Content "$EmergencyConfigPath\claude-solo-emergency-layout.yml" -Raw
        
        if ($layoutConfig -match "layout_analyzer" -and $layoutConfig -match "css_debugger" -and $layoutConfig -match "emergency_fixer") {
            Write-Success "Layout emergency agents configured"
            Add-ValidationResult "Layout Emergency" "Agent Configuration" "Pass" "All agents configured"
        } else {
            Write-Error "Layout emergency agents missing or misconfigured"
            Add-ValidationResult "Layout Emergency" "Agent Configuration" "Fail" "Agents missing or misconfigured"
        }
        
        # Test layout monitoring triggers
        if ($layoutConfig -match "viewport_analysis" -and $layoutConfig -match "layout_width_utilization") {
            Write-Success "Layout monitoring triggers configured"
            Add-ValidationResult "Layout Emergency" "Monitoring Triggers" "Pass" "Triggers configured"
        } else {
            Write-Warning "Layout monitoring triggers may be incomplete"
            Add-ValidationResult "Layout Emergency" "Monitoring Triggers" "Warning" "Triggers incomplete"
        }
        
    } catch {
        Write-Error "Layout emergency system validation failed: $($_.Exception.Message)"
        Add-ValidationResult "Layout Emergency" "System Validation" "Fail" "Error: $($_.Exception.Message)"
    }
}

# Test asset recovery system
function Test-AssetRecoverySystem {
    Write-Header "VALIDATING ASSET RECOVERY SYSTEM"
    
    # Check critical asset paths
    $criticalAssets = @(
        "$ProjectRoot\src\assets\brands\banner.png",
        "$ProjectRoot\src\assets\brands\gearLogo.png",
        "$ProjectRoot\src\assets\brands\mainLogo.png",
        "$ProjectRoot\public\assets\brands\favicon.png"
    )
    
    foreach ($asset in $criticalAssets) {
        if (Test-Path $asset) {
            $size = (Get-Item $asset).Length
            Write-Success "Asset found: $(Split-Path -Leaf $asset) ($size bytes)"
            Add-ValidationResult "Asset Recovery" "$(Split-Path -Leaf $asset)" "Pass" "Asset exists, size: $size bytes"
        } else {
            Write-Warning "Asset missing: $(Split-Path -Leaf $asset)"
            Add-ValidationResult "Asset Recovery" "$(Split-Path -Leaf $asset)" "Warning" "Asset missing"
        }
    }
    
    # Test asset recovery configuration
    try {
        $assetConfig = Get-Content "$EmergencyConfigPath\claude-solo-asset-recovery.yml" -Raw
        
        if ($assetConfig -match "asset_recovery_agent" -and $assetConfig -match "api_integration_agent") {
            Write-Success "Asset recovery agents configured"
            Add-ValidationResult "Asset Recovery" "Agent Configuration" "Pass" "Agents configured"
        } else {
            Write-Error "Asset recovery agents missing"
            Add-ValidationResult "Asset Recovery" "Agent Configuration" "Fail" "Agents missing"
        }
        
    } catch {
        Write-Error "Asset recovery system validation failed: $($_.Exception.Message)"
        Add-ValidationResult "Asset Recovery" "System Validation" "Fail" "Error: $($_.Exception.Message)"
    }
}

# Test multi-domain system
function Test-MultiDomainSystem {
    Write-Header "VALIDATING MULTI-DOMAIN SYSTEM"
    
    $domains = @(
        "straydog-syndications-llc.com",
        "straydogsyndicationsllc.biz",
        "straydog-secondstory.org",
        "straydogsyn.github.io"
    )
    
    foreach ($domain in $domains) {
        try {
            Write-Info "Testing domain: $domain"
            
            if (-not $DryRun) {
                # Test DNS resolution
                $dnsResult = Resolve-DnsName $domain -ErrorAction SilentlyContinue
                if ($dnsResult) {
                    Write-Success "  └─ DNS resolution: OK"
                    Add-ValidationResult "Multi-Domain" "$domain DNS" "Pass" "DNS resolves"
                } else {
                    Write-Warning "  └─ DNS resolution: Failed"
                    Add-ValidationResult "Multi-Domain" "$domain DNS" "Warning" "DNS resolution failed"
                }
                
                # Test HTTP connectivity (basic)
                try {
                    $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -TimeoutSec 10 -ErrorAction SilentlyContinue
                    if ($response.StatusCode -eq 200) {
                        Write-Success "  └─ HTTP connectivity: OK (Status: $($response.StatusCode))"
                        Add-ValidationResult "Multi-Domain" "$domain HTTP" "Pass" "HTTP 200 OK"
                    } else {
                        Write-Warning "  └─ HTTP connectivity: Status $($response.StatusCode)"
                        Add-ValidationResult "Multi-Domain" "$domain HTTP" "Warning" "HTTP Status: $($response.StatusCode)"
                    }
                } catch {
                    Write-Warning "  └─ HTTP connectivity: Failed - $($_.Exception.Message)"
                    Add-ValidationResult "Multi-Domain" "$domain HTTP" "Warning" "HTTP failed: $($_.Exception.Message)"
                }
            } else {
                Write-Info "  └─ Skipping network tests (Dry Run mode)"
                Add-ValidationResult "Multi-Domain" "$domain" "Skip" "Skipped in dry run mode"
            }
            
        } catch {
            Write-Error "Domain validation failed for ${domain}: $($_.Exception.Message)"
            Add-ValidationResult "Multi-Domain" "$domain" "Fail" "Error: $($_.Exception.Message)"
        }
    }
    
    # Test multi-domain configuration
    try {
        $domainConfig = Get-Content "$EmergencyConfigPath\claude-solo-multi-domain-orchestration.yml" -Raw
        
        if ($domainConfig -match "domain_orchestrator" -and $domainConfig -match "content_synchronizer") {
            Write-Success "Multi-domain orchestration configured"
            Add-ValidationResult "Multi-Domain" "Orchestration Config" "Pass" "Configuration valid"
        } else {
            Write-Error "Multi-domain orchestration misconfigured"
            Add-ValidationResult "Multi-Domain" "Orchestration Config" "Fail" "Configuration invalid"
        }
        
    } catch {
        Write-Error "Multi-domain system validation failed: $($_.Exception.Message)"
        Add-ValidationResult "Multi-Domain" "System Validation" "Fail" "Error: $($_.Exception.Message)"
    }
}

# Test monitoring dashboard
function Test-MonitoringDashboard {
    Write-Header "VALIDATING MONITORING DASHBOARD"
    
    try {
        $dashboardConfig = Get-Content "$EmergencyConfigPath\emergency-monitoring-dashboard.yml" -Raw
        
        # Check dashboard configuration sections
        $requiredSections = @(
            "emergency_status",
            "layout_monitoring",
            "asset_monitoring",
            "multi_domain_monitoring",
            "performance_monitoring"
        )
        
        foreach ($section in $requiredSections) {
            if ($dashboardConfig -match $section) {
                Write-Success "Dashboard section configured: $section"
                Add-ValidationResult "Monitoring" "$section Section" "Pass" "Section configured"
            } else {
                Write-Warning "Dashboard section missing: $section"
                Add-ValidationResult "Monitoring" "$section Section" "Warning" "Section missing"
            }
        }
        
        # Check alert configuration
        if ($dashboardConfig -match "alerts:" -and $dashboardConfig -match "layout_crisis") {
            Write-Success "Alert configuration found"
            Add-ValidationResult "Monitoring" "Alert Configuration" "Pass" "Alerts configured"
        } else {
            Write-Warning "Alert configuration incomplete"
            Add-ValidationResult "Monitoring" "Alert Configuration" "Warning" "Alerts incomplete"
        }
        
    } catch {
        Write-Error "Monitoring dashboard validation failed: $($_.Exception.Message)"
        Add-ValidationResult "Monitoring" "Dashboard Validation" "Fail" "Error: $($_.Exception.Message)"
    }
}

# Test emergency deployment script
function Test-EmergencyDeploymentScript {
    Write-Header "VALIDATING EMERGENCY DEPLOYMENT SCRIPT"
    
    $deployScript = "$EmergencyConfigPath\emergency-deploy.ps1"
    
    if (Test-Path $deployScript) {
        Write-Success "Emergency deployment script found"
        Add-ValidationResult "Deployment" "Script Exists" "Pass" "Script file exists"
        
        # Test script syntax
        try {
            $scriptContent = Get-Content $deployScript -Raw
            
            # Check for required functions
            $requiredFunctions = @(
                "Show-EmergencyBanner",
                "Test-Prerequisites",
                "Backup-CurrentState",
                "Start-EmergencyProtocol"
            )
            
            foreach ($func in $requiredFunctions) {
                if ($scriptContent -match "function $func") {
                    Write-Success "  └─ Function found: $func"
                    Add-ValidationResult "Deployment" "Function $func" "Pass" "Function exists"
                } else {
                    Write-Warning "  └─ Function missing: $func"
                    Add-ValidationResult "Deployment" "Function $func" "Warning" "Function missing"
                }
            }
            
            # Test script parameters
            if ($scriptContent -match "param\(" -and $scriptContent -match "EmergencyType") {
                Write-Success "  └─ Script parameters configured"
                Add-ValidationResult "Deployment" "Script Parameters" "Pass" "Parameters configured"
            } else {
                Write-Warning "  └─ Script parameters may be incomplete"
                Add-ValidationResult "Deployment" "Script Parameters" "Warning" "Parameters incomplete"
            }
            
        } catch {
            Write-Error "Script syntax validation failed: $($_.Exception.Message)"
            Add-ValidationResult "Deployment" "Script Syntax" "Fail" "Syntax error: $($_.Exception.Message)"
        }
    } else {
        Write-Error "Emergency deployment script missing"
        Add-ValidationResult "Deployment" "Script Exists" "Fail" "Script file missing"
    }
}

# Test package configuration
function Test-PackageConfiguration {
    Write-Header "VALIDATING PACKAGE CONFIGURATION"
    
    $packageFile = "$EmergencyConfigPath\package-claude-solo.json"
    
    if (Test-Path $packageFile) {
        try {
            $packageConfig = Get-Content $packageFile -Raw | ConvertFrom-Json
            
            Write-Success "Package configuration loaded"
            Add-ValidationResult "Package" "Configuration Load" "Pass" "JSON valid"
            
            # Check required scripts
            $requiredScripts = @(
                "emergency:layout",
                "emergency:assets",
                "emergency:multi-domain",
                "monitor:emergency",
                "validate:emergency"
            )
            
            foreach ($script in $requiredScripts) {
                if ($packageConfig.scripts.PSObject.Properties.Name -contains $script) {
                    Write-Success "  └─ Script configured: $script"
                    Add-ValidationResult "Package" "Script $script" "Pass" "Script exists"
                } else {
                    Write-Warning "  └─ Script missing: $script"
                    Add-ValidationResult "Package" "Script $script" "Warning" "Script missing"
                }
            }
            
            # Check dependencies
            if ($packageConfig.dependencies) {
                $depCount = ($packageConfig.dependencies.PSObject.Properties).Count
                Write-Success "  └─ Dependencies configured: $depCount packages"
                Add-ValidationResult "Package" "Dependencies" "Pass" "$depCount dependencies"
            } else {
                Write-Warning "  └─ No dependencies configured"
                Add-ValidationResult "Package" "Dependencies" "Warning" "No dependencies"
            }
            
        } catch {
            Write-Error "Package configuration validation failed: $($_.Exception.Message)"
            Add-ValidationResult "Package" "Configuration Validation" "Fail" "Error: $($_.Exception.Message)"
        }
    } else {
        Write-Error "Package configuration missing"
        Add-ValidationResult "Package" "Configuration Exists" "Fail" "File missing"
    }
}

# Generate validation report
function Generate-ValidationReport {
    Write-Header "GENERATING VALIDATION REPORT"
    
    $endTime = Get-Date
    $duration = $endTime - $script:StartTime
    
    # Summary statistics
    $totalTests = $script:ValidationResults.Count
    $passedTests = ($script:ValidationResults | Where-Object { $_.Status -eq "Pass" }).Count
    $failedTests = ($script:ValidationResults | Where-Object { $_.Status -eq "Fail" }).Count
    $warningTests = ($script:ValidationResults | Where-Object { $_.Status -eq "Warning" }).Count
    $skippedTests = ($script:ValidationResults | Where-Object { $_.Status -eq "Skip" }).Count
    
    $successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 2) } else { 0 }
    
    # Display summary
    Write-Host "`n" -NoNewline
    Write-Host "╔══════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                           VALIDATION SUMMARY                                ║" -ForegroundColor Cyan
    Write-Host "╠══════════════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║ Total Tests: $($totalTests.ToString().PadLeft(3))                                                           ║" -ForegroundColor Cyan
    Write-Host "║ Passed:      $($passedTests.ToString().PadLeft(3)) ($(($successRate.ToString() + '%').PadLeft(6)))                                           ║" -ForegroundColor Green
    Write-Host "║ Failed:      $($failedTests.ToString().PadLeft(3))                                                           ║" -ForegroundColor Red
    Write-Host "║ Warnings:    $($warningTests.ToString().PadLeft(3))                                                           ║" -ForegroundColor Yellow
    Write-Host "║ Skipped:     $($skippedTests.ToString().PadLeft(3))                                                           ║" -ForegroundColor Gray
    Write-Host "║                                                                              ║" -ForegroundColor Cyan
    Write-Host "║ Duration: $($duration.ToString('mm\:ss').PadLeft(5))                                                        ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    # Category breakdown
    Write-Host "`nValidation Results by Category:" -ForegroundColor Magenta
    $categories = $script:ValidationResults | Group-Object Category
    foreach ($category in $categories) {
        $catPassed = ($category.Group | Where-Object { $_.Status -eq "Pass" }).Count
        $catTotal = $category.Count
        $catRate = if ($catTotal -gt 0) { [math]::Round(($catPassed / $catTotal) * 100, 1) } else { 0 }
        
        $statusColor = if ($catRate -ge 80) { "Green" } elseif ($catRate -ge 60) { "Yellow" } else { "Red" }
        Write-Host "  $($category.Name): $catPassed/$catTotal ($catRate%)" -ForegroundColor $statusColor
    }
    
    # Failed tests detail
    if ($failedTests -gt 0) {
        Write-Host "`nFailed Tests:" -ForegroundColor Red
        $script:ValidationResults | Where-Object { $_.Status -eq "Fail" } | ForEach-Object {
            Write-Host "  ❌ [$($_.Category)] $($_.Test): $($_.Message)" -ForegroundColor Red
        }
    }
    
    # Warning tests detail
    if ($warningTests -gt 0) {
        Write-Host "`nWarning Tests:" -ForegroundColor Yellow
        $script:ValidationResults | Where-Object { $_.Status -eq "Warning" } | ForEach-Object {
            Write-Host "  ⚠️  [$($_.Category)] $($_.Test): $($_.Message)" -ForegroundColor Yellow
        }
    }
    
    # Generate report file if requested
    if ($GenerateReport) {
        $reportPath = "$EmergencyConfigPath\emergency-validation-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
        
        $report = @{
            Timestamp = $script:StartTime
            Duration = $duration.TotalSeconds
            TestType = $TestType
            FullValidation = $FullValidation
            DryRun = $DryRun
            Summary = @{
                TotalTests = $totalTests
                PassedTests = $passedTests
                FailedTests = $failedTests
                WarningTests = $warningTests
                SkippedTests = $skippedTests
                SuccessRate = $successRate
            }
            Results = $script:ValidationResults
        }
        
        $report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8
        Write-Info "Detailed report saved: $reportPath"
    }
    
    # Overall status
    if ($failedTests -eq 0 -and $warningTests -le 2) {
        Write-Success "`n🎉 Emergency system validation PASSED! All systems ready for deployment."
        return $true
    } elseif ($failedTests -eq 0) {
        Write-Warning "`n⚠️  Emergency system validation completed with warnings. Review warnings before deployment."
        return $true
    } else {
        Write-Error "`n❌ Emergency system validation FAILED! Address failed tests before deployment."
        return $false
    }
}

# Main execution
function Main {
    Show-EmergencyValidationBanner
    
    try {
        # Always run prerequisites and configuration checks
        Test-Prerequisites
        Test-EmergencyConfigurations
        Test-EnvironmentVariables
        Test-PackageConfiguration
        
        # Run specific tests based on TestType parameter
        switch ($TestType.ToLower()) {
            "layout" {
                Test-LayoutEmergencySystem
            }
            "assets" {
                Test-AssetRecoverySystem
            }
            "domains" {
                Test-MultiDomainSystem
            }
            "monitoring" {
                Test-MonitoringDashboard
            }
            "all" {
                Test-LayoutEmergencySystem
                Test-AssetRecoverySystem
                Test-MultiDomainSystem
                Test-MonitoringDashboard
                Test-EmergencyDeploymentScript
            }
            default {
                Write-Warning "Unknown test type: $TestType. Running all tests."
                Test-LayoutEmergencySystem
                Test-AssetRecoverySystem
                Test-MultiDomainSystem
                Test-MonitoringDashboard
                Test-EmergencyDeploymentScript
            }
        }
        
        # Generate and display report
        $validationPassed = Generate-ValidationReport
        
        if ($validationPassed) {
            Write-Host "`n🚀 Emergency systems are ready for deployment!" -ForegroundColor Green -BackgroundColor Black
            exit 0
        } else {
            Write-Host "`n🛑 Emergency systems require attention before deployment!" -ForegroundColor Red -BackgroundColor Black
            exit 1
        }
        
    } catch {
        Write-Error "Emergency validation failed with error: $($_.Exception.Message)"
        Write-Error "Stack trace: $($_.ScriptStackTrace)"
        exit 1
    }
}

# Execute main function
Main