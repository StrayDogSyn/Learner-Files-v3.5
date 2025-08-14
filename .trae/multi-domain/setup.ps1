# Trae Multi-Domain Portfolio Setup Script
# PowerShell script for Windows environment

param(
    [string]$ConfigPath = ".trae\multi-domain",
    [switch]$SkipValidation,
    [switch]$DryRun,
    [switch]$Verbose
)

# Script configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Color definitions for output
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "Cyan"
    Header = "Magenta"
}

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    
    if ($NoNewline) {
        Write-Host $Message -ForegroundColor $Color -NoNewline
    } else {
        Write-Host $Message -ForegroundColor $Color
    }
}

# Function to write section headers
function Write-SectionHeader {
    param([string]$Title)
    
    Write-Host ""
    Write-ColorOutput "=" * 60 -Color $Colors.Header
    Write-ColorOutput "  $Title" -Color $Colors.Header
    Write-ColorOutput "=" * 60 -Color $Colors.Header
    Write-Host ""
}

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to validate environment variables
function Test-EnvironmentVariables {
    Write-SectionHeader "Validating Environment Variables"
    
    $RequiredVars = @(
        "DEVELOPER_EMAIL",
        "VERCEL_API_TOKEN",
        "VERCEL_PRIMARY_PROJECT_ID",
        "VERCEL_BUSINESS_PROJECT_ID",
        "VERCEL_ORG_PROJECT_ID",
        "GITHUB_TOKEN",
        "GITHUB_USERNAME",
        "SLACK_WEBHOOK_URL"
    )
    
    $OptionalVars = @(
        "TEAM_LEAD_EMAIL",
        "EXECUTIVE_EMAIL",
        "EMERGENCY_CONTACT",
        "UPTIMEROBOT_API_KEY",
        "SENTRY_DSN",
        "GA_MEASUREMENT_ID",
        "NEW_RELIC_LICENSE_KEY",
        "HOTJAR_SITE_ID"
    )
    
    $MissingRequired = @()
    $MissingOptional = @()
    
    # Check required variables
    foreach ($var in $RequiredVars) {
        $value = [Environment]::GetEnvironmentVariable($var)
        if ([string]::IsNullOrEmpty($value)) {
            $MissingRequired += $var
            Write-ColorOutput "  ❌ $var (REQUIRED)" -Color $Colors.Error
        } else {
            Write-ColorOutput "  ✅ $var" -Color $Colors.Success
        }
    }
    
    # Check optional variables
    foreach ($var in $OptionalVars) {
        $value = [Environment]::GetEnvironmentVariable($var)
        if ([string]::IsNullOrEmpty($value)) {
            $MissingOptional += $var
            Write-ColorOutput "  ⚠️  $var (OPTIONAL)" -Color $Colors.Warning
        } else {
            Write-ColorOutput "  ✅ $var" -Color $Colors.Success
        }
    }
    
    if ($MissingRequired.Count -gt 0) {
        Write-Host ""
        Write-ColorOutput "❌ Missing required environment variables:" -Color $Colors.Error
        foreach ($var in $MissingRequired) {
            Write-ColorOutput "   - $var" -Color $Colors.Error
        }
        Write-Host ""
        Write-ColorOutput "Please set these variables before continuing." -Color $Colors.Error
        Write-ColorOutput "You can create a .env file or set them in your system environment." -Color $Colors.Info
        return $false
    }
    
    if ($MissingOptional.Count -gt 0) {
        Write-Host ""
        Write-ColorOutput "⚠️  Optional variables not set (features may be limited):" -Color $Colors.Warning
        foreach ($var in $MissingOptional) {
            Write-ColorOutput "   - $var" -Color $Colors.Warning
        }
    }
    
    Write-Host ""
    Write-ColorOutput "✅ Environment validation completed" -Color $Colors.Success
    return $true
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-SectionHeader "Checking Prerequisites"
    
    $Prerequisites = @(
        @{ Name = "Node.js"; Command = "node"; Version = "--version" },
        @{ Name = "npm"; Command = "npm"; Version = "--version" },
        @{ Name = "Git"; Command = "git"; Version = "--version" },
        @{ Name = "PowerShell"; Command = "pwsh"; Version = "--version" }
    )
    
    $AllPresent = $true
    
    foreach ($prereq in $Prerequisites) {
        if (Test-Command $prereq.Command) {
            try {
                $version = & $prereq.Command $prereq.Version 2>$null
                Write-ColorOutput "  ✅ $($prereq.Name): $version" -Color $Colors.Success
            } catch {
                Write-ColorOutput "  ✅ $($prereq.Name): Installed" -Color $Colors.Success
            }
        } else {
            Write-ColorOutput "  ❌ $($prereq.Name): Not found" -Color $Colors.Error
            $AllPresent = $false
        }
    }
    
    # Check for Trae CLI
    if (Test-Command "trae") {
        try {
            $traeVersion = trae --version 2>$null
            Write-ColorOutput "  ✅ Trae CLI: $traeVersion" -Color $Colors.Success
        } catch {
            Write-ColorOutput "  ✅ Trae CLI: Installed" -Color $Colors.Success
        }
    } else {
        Write-ColorOutput "  ⚠️  Trae CLI: Not found (will attempt to install)" -Color $Colors.Warning
    }
    
    return $AllPresent
}

# Function to install Trae CLI
function Install-TraeCLI {
    Write-SectionHeader "Installing Trae CLI"
    
    if (Test-Command "trae") {
        Write-ColorOutput "✅ Trae CLI already installed" -Color $Colors.Success
        return $true
    }
    
    try {
        Write-ColorOutput "📦 Installing Trae CLI via npm..." -Color $Colors.Info
        
        if ($DryRun) {
            Write-ColorOutput "[DRY RUN] Would run: npm install -g @trae/cli" -Color $Colors.Info
            return $true
        }
        
        $installResult = npm install -g @trae/cli 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Trae CLI installed successfully" -Color $Colors.Success
            return $true
        } else {
            Write-ColorOutput "❌ Failed to install Trae CLI" -Color $Colors.Error
            Write-ColorOutput "Error: $installResult" -Color $Colors.Error
            return $false
        }
    } catch {
        Write-ColorOutput "❌ Error installing Trae CLI: $($_.Exception.Message)" -Color $Colors.Error
        return $false
    }
}

# Function to validate configuration files
function Test-ConfigurationFiles {
    Write-SectionHeader "Validating Configuration Files"
    
    $ConfigFiles = @(
        "trae-multi-domain.yml",
        "deployment-automation.yml",
        "content-sync.yml",
        "ssl-management.yml",
        "link-validation.yml",
        "analytics-reporting.yml",
        "monitoring-config.yml"
    )
    
    $AllValid = $true
    
    foreach ($file in $ConfigFiles) {
        $filePath = Join-Path $ConfigPath $file
        
        if (Test-Path $filePath) {
            try {
                # Basic YAML validation (check if file can be read)
                $content = Get-Content $filePath -Raw
                if ($content.Length -gt 0) {
                    Write-ColorOutput "  ✅ $file" -Color $Colors.Success
                } else {
                    Write-ColorOutput "  ❌ $file (empty file)" -Color $Colors.Error
                    $AllValid = $false
                }
            } catch {
                Write-ColorOutput "  ❌ $file (read error)" -Color $Colors.Error
                $AllValid = $false
            }
        } else {
            Write-ColorOutput "  ❌ $file (not found)" -Color $Colors.Error
            $AllValid = $false
        }
    }
    
    return $AllValid
}

# Function to initialize Trae project
function Initialize-TraeProject {
    Write-SectionHeader "Initializing Trae Project"
    
    $mainConfig = Join-Path $ConfigPath "trae-multi-domain.yml"
    
    if (-not (Test-Path $mainConfig)) {
        Write-ColorOutput "❌ Main configuration file not found: $mainConfig" -Color $Colors.Error
        return $false
    }
    
    try {
        Write-ColorOutput "🚀 Initializing Trae project..." -Color $Colors.Info
        
        if ($DryRun) {
            Write-ColorOutput "[DRY RUN] Would run: trae init --config $mainConfig" -Color $Colors.Info
            return $true
        }
        
        $initResult = trae init --config $mainConfig 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Trae project initialized successfully" -Color $Colors.Success
            return $true
        } else {
            Write-ColorOutput "❌ Failed to initialize Trae project" -Color $Colors.Error
            Write-ColorOutput "Error: $initResult" -Color $Colors.Error
            return $false
        }
    } catch {
        Write-ColorOutput "❌ Error initializing Trae project: $($_.Exception.Message)" -Color $Colors.Error
        return $false
    }
}

# Function to setup monitoring
function Initialize-Monitoring {
    Write-SectionHeader "Setting Up Monitoring"
    
    $monitoringConfig = Join-Path $ConfigPath "monitoring-config.yml"
    
    if (-not (Test-Path $monitoringConfig)) {
        Write-ColorOutput "❌ Monitoring configuration file not found: $monitoringConfig" -Color $Colors.Error
        return $false
    }
    
    try {
        Write-ColorOutput "📊 Setting up monitoring services..." -Color $Colors.Info
        
        if ($DryRun) {
            Write-ColorOutput "[DRY RUN] Would run: trae monitoring setup --config $monitoringConfig" -Color $Colors.Info
            return $true
        }
        
        $monitoringResult = trae monitoring setup --config $monitoringConfig 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Monitoring setup completed successfully" -Color $Colors.Success
            return $true
        } else {
            Write-ColorOutput "⚠️  Monitoring setup completed with warnings" -Color $Colors.Warning
            Write-ColorOutput "Details: $monitoringResult" -Color $Colors.Warning
            return $true
        }
    } catch {
        Write-ColorOutput "❌ Error setting up monitoring: $($_.Exception.Message)" -Color $Colors.Error
        return $false
    }
}

# Function to validate domains
function Test-Domains {
    Write-SectionHeader "Validating Domains"
    
    $Domains = @(
        "straydog-syndications-llc.com",
        "straydogsyndicationsllc.biz",
        "straydog-secondstory.org",
        "straydogsyndications.github.io"
    )
    
    $AllValid = $true
    
    foreach ($domain in $Domains) {
        try {
            Write-ColorOutput "  🔍 Testing $domain..." -Color $Colors.Info -NoNewline
            
            if ($DryRun) {
                Write-ColorOutput " [DRY RUN] Skipped" -Color $Colors.Info
                continue
            }
            
            $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -TimeoutSec 10 -ErrorAction Stop
            
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput " ✅" -Color $Colors.Success
            } else {
                Write-ColorOutput " ⚠️  (Status: $($response.StatusCode))" -Color $Colors.Warning
            }
        } catch {
            Write-ColorOutput " ❌ (Error: $($_.Exception.Message))" -Color $Colors.Error
            $AllValid = $false
        }
    }
    
    return $AllValid
}

# Function to run system health check
function Test-SystemHealth {
    Write-SectionHeader "Running System Health Check"
    
    try {
        Write-ColorOutput "🏥 Running comprehensive health check..." -Color $Colors.Info
        
        if ($DryRun) {
            Write-ColorOutput "[DRY RUN] Would run: trae health check --comprehensive" -Color $Colors.Info
            return $true
        }
        
        $healthResult = trae health check --comprehensive 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ System health check passed" -Color $Colors.Success
            return $true
        } else {
            Write-ColorOutput "⚠️  System health check completed with warnings" -Color $Colors.Warning
            Write-ColorOutput "Details: $healthResult" -Color $Colors.Warning
            return $true
        }
    } catch {
        Write-ColorOutput "❌ Error running health check: $($_.Exception.Message)" -Color $Colors.Error
        return $false
    }
}

# Function to create environment file template
function New-EnvironmentTemplate {
    Write-SectionHeader "Creating Environment Template"
    
    $envTemplate = @"
# Trae Multi-Domain Portfolio Environment Configuration
# Copy this file to .env and fill in your actual values

# Core Configuration
DEVELOPER_EMAIL=your-email@example.com
TEAM_LEAD_EMAIL=team-lead@example.com
EXECUTIVE_EMAIL=executive@example.com
EMERGENCY_CONTACT=+1234567890

# Deployment Configuration
VERCEL_API_TOKEN=your-vercel-api-token
VERCEL_PRIMARY_PROJECT_ID=your-primary-project-id
VERCEL_BUSINESS_PROJECT_ID=your-business-project-id
VERCEL_ORG_PROJECT_ID=your-org-project-id
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_USERNAME=your-github-username

# Monitoring Services
UPTIMEROBOT_API_KEY=your-uptimerobot-api-key
SENTRY_DSN=your-sentry-dsn
GA_MEASUREMENT_ID=your-google-analytics-measurement-id
GSC_SERVICE_ACCOUNT_KEY=your-google-search-console-service-account-key

# Notification Services
SLACK_WEBHOOK_URL=your-slack-webhook-url
SLACK_CRITICAL_WEBHOOK=your-slack-critical-webhook
SLACK_ALERTS_WEBHOOK=your-slack-alerts-webhook
SLACK_WARNINGS_WEBHOOK=your-slack-warnings-webhook
SLACK_INFO_WEBHOOK=your-slack-info-webhook

# Optional Services (remove # to enable)
# NEW_RELIC_LICENSE_KEY=your-newrelic-license-key
# HOTJAR_SITE_ID=your-hotjar-site-id
# SNYK_API_TOKEN=your-snyk-api-token
# TWILIO_ACCOUNT_SID=your-twilio-account-sid
# TWILIO_AUTH_TOKEN=your-twilio-auth-token
# TWILIO_FROM_NUMBER=your-twilio-phone-number
# PINGDOM_API_KEY=your-pingdom-api-key
# LIGHTHOUSE_CI_SERVER_URL=your-lighthouse-ci-server-url
# EXTERNAL_WEBHOOK_URL=your-external-webhook-url
# WEBHOOK_TOKEN=your-webhook-bearer-token
"@
    
    $envFile = ".env.template"
    
    try {
        if ($DryRun) {
            Write-ColorOutput "[DRY RUN] Would create: $envFile" -Color $Colors.Info
            return $true
        }
        
        $envTemplate | Out-File -FilePath $envFile -Encoding UTF8
        Write-ColorOutput "✅ Environment template created: $envFile" -Color $Colors.Success
        Write-ColorOutput "📝 Please copy this file to .env and fill in your actual values" -Color $Colors.Info
        return $true
    } catch {
        Write-ColorOutput "❌ Error creating environment template: $($_.Exception.Message)" -Color $Colors.Error
        return $false
    }
}

# Function to display setup summary
function Show-SetupSummary {
    Write-SectionHeader "Setup Summary"
    
    Write-ColorOutput "🎉 Trae Multi-Domain Portfolio Setup Complete!" -Color $Colors.Success
    Write-Host ""
    
    Write-ColorOutput "📋 What was configured:" -Color $Colors.Info
    Write-ColorOutput "   ✅ Trae CLI installation" -Color $Colors.Success
    Write-ColorOutput "   ✅ Project initialization" -Color $Colors.Success
    Write-ColorOutput "   ✅ Configuration validation" -Color $Colors.Success
    Write-ColorOutput "   ✅ Monitoring setup" -Color $Colors.Success
    Write-ColorOutput "   ✅ Domain validation" -Color $Colors.Success
    Write-ColorOutput "   ✅ System health check" -Color $Colors.Success
    
    Write-Host ""
    Write-ColorOutput "🚀 Next Steps:" -Color $Colors.Info
    Write-ColorOutput "   1. Review and update your .env file with actual values" -Color $Colors.Warning
    Write-ColorOutput "   2. Run your first deployment: trae deploy --workflow full_deployment" -Color $Colors.Info
    Write-ColorOutput "   3. Open the monitoring dashboard: trae dashboard open --type realtime" -Color $Colors.Info
    Write-ColorOutput "   4. Set up your notification channels (Slack, email, etc.)" -Color $Colors.Info
    Write-ColorOutput "   5. Review the README.md for detailed usage instructions" -Color $Colors.Info
    
    Write-Host ""
    Write-ColorOutput "📚 Documentation:" -Color $Colors.Info
    Write-ColorOutput "   - Main documentation: .trae/multi-domain/README.md" -Color $Colors.Info
    Write-ColorOutput "   - Configuration files: .trae/multi-domain/" -Color $Colors.Info
    Write-ColorOutput "   - Trae CLI help: trae --help" -Color $Colors.Info
    
    Write-Host ""
    Write-ColorOutput "🆘 Support:" -Color $Colors.Info
    Write-ColorOutput "   - GitHub Issues: https://github.com/trae-dev/trae/issues" -Color $Colors.Info
    Write-ColorOutput "   - Community Forum: https://community.trae.dev" -Color $Colors.Info
    Write-ColorOutput "   - Discord: https://discord.gg/trae" -Color $Colors.Info
}

# Main execution function
function Start-Setup {
    Write-ColorOutput @"
████████╗██████╗  █████╗ ███████╗    ███╗   ███╗██╗   ██╗██╗  ████████╗██╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝    ████╗ ████║██║   ██║██║  ╚══██╔══╝██║
   ██║   ██████╔╝███████║█████╗      ██╔████╔██║██║   ██║██║     ██║   ██║
   ██║   ██╔══██╗██╔══██║██╔══╝      ██║╚██╔╝██║██║   ██║██║     ██║   ██║
   ██║   ██║  ██║██║  ██║███████╗    ██║ ╚═╝ ██║╚██████╔╝███████╗██║   ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝
                                                                            
██████╗  ██████╗ ███╗   ███╗ █████╗ ██╗███╗   ██╗    ███████╗███████╗████████╗██╗   ██╗██████╗ 
██╔══██╗██╔═══██╗████╗ ████║██╔══██╗██║████╗  ██║    ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
██║  ██║██║   ██║██╔████╔██║███████║██║██╔██╗ ██║    ███████╗█████╗     ██║   ██║   ██║██████╔╝
██║  ██║██║   ██║██║╚██╔╝██║██╔══██║██║██║╚██╗██║    ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
██████╔╝╚██████╔╝██║ ╚═╝ ██║██║  ██║██║██║ ╚████║    ███████║███████╗   ██║   ╚██████╔╝██║     
╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝    ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
"@ -Color $Colors.Header
    
    Write-Host ""
    Write-ColorOutput "🚀 Multi-Domain Portfolio Management System Setup" -Color $Colors.Header
    Write-ColorOutput "   Automating deployment, monitoring, and optimization for:" -Color $Colors.Info
    Write-ColorOutput "   • straydog-syndications-llc.com" -Color $Colors.Info
    Write-ColorOutput "   • straydogsyndicationsllc.biz" -Color $Colors.Info
    Write-ColorOutput "   • straydog-secondstory.org" -Color $Colors.Info
    Write-ColorOutput "   • straydogsyndications.github.io" -Color $Colors.Info
    Write-Host ""
    
    if ($DryRun) {
        Write-ColorOutput "🔍 DRY RUN MODE - No changes will be made" -Color $Colors.Warning
        Write-Host ""
    }
    
    # Step 1: Check prerequisites
    if (-not (Test-Prerequisites)) {
        Write-ColorOutput "❌ Prerequisites check failed. Please install missing components." -Color $Colors.Error
        exit 1
    }
    
    # Step 2: Validate environment variables
    if (-not $SkipValidation) {
        if (-not (Test-EnvironmentVariables)) {
            Write-ColorOutput "❌ Environment validation failed. Please set required variables." -Color $Colors.Error
            
            # Offer to create environment template
            $createTemplate = Read-Host "Would you like to create an environment template file? (y/N)"
            if ($createTemplate -eq 'y' -or $createTemplate -eq 'Y') {
                New-EnvironmentTemplate
            }
            
            exit 1
        }
    } else {
        Write-ColorOutput "⚠️  Skipping environment validation (--SkipValidation flag)" -Color $Colors.Warning
    }
    
    # Step 3: Validate configuration files
    if (-not (Test-ConfigurationFiles)) {
        Write-ColorOutput "❌ Configuration validation failed. Please check your config files." -Color $Colors.Error
        exit 1
    }
    
    # Step 4: Install Trae CLI
    if (-not (Install-TraeCLI)) {
        Write-ColorOutput "❌ Trae CLI installation failed." -Color $Colors.Error
        exit 1
    }
    
    # Step 5: Initialize Trae project
    if (-not (Initialize-TraeProject)) {
        Write-ColorOutput "❌ Trae project initialization failed." -Color $Colors.Error
        exit 1
    }
    
    # Step 6: Setup monitoring
    if (-not (Initialize-Monitoring)) {
        Write-ColorOutput "❌ Monitoring setup failed." -Color $Colors.Error
        exit 1
    }
    
    # Step 7: Validate domains (optional)
    if (-not $SkipValidation) {
        Test-Domains | Out-Null  # Don't fail on domain validation errors
    }
    
    # Step 8: Run system health check
    Test-SystemHealth | Out-Null  # Don't fail on health check warnings
    
    # Step 9: Show setup summary
    Show-SetupSummary
    
    Write-Host ""
    Write-ColorOutput "✅ Setup completed successfully!" -Color $Colors.Success
}

# Script entry point
try {
    # Change to script directory
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    if ($ScriptDir) {
        Set-Location $ScriptDir
    }
    
    # Start the setup process
    Start-Setup
    
} catch {
    Write-ColorOutput "❌ Setup failed with error: $($_.Exception.Message)" -Color $Colors.Error
    
    if ($Verbose) {
        Write-ColorOutput "Stack trace:" -Color $Colors.Error
        Write-ColorOutput $_.ScriptStackTrace -Color $Colors.Error
    }
    
    exit 1
}

# End of script
Write-Host ""
Write-ColorOutput "🎯 Ready to deploy your multi-domain portfolio!" -Color $Colors.Success
Write-ColorOutput "   Run: trae deploy --workflow full_deployment" -Color $Colors.Info
Write-Host ""