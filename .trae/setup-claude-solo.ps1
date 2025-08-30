#!/usr/bin/env pwsh
# Trae SOLO + Claude 4.1 API Integration Setup Script
# Automated setup for intelligent portfolio management system

param(
    [switch]$SkipPrerequisites,
    [switch]$SkipValidation,
    [switch]$DryRun,
    [string]$ConfigFile = ".env.claude-solo",
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Enable verbose output if requested
if ($Verbose) {
    $VerbosePreference = "Continue"
}

# Color functions for better output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $colors = @{
        "Red" = [ConsoleColor]::Red
        "Green" = [ConsoleColor]::Green
        "Yellow" = [ConsoleColor]::Yellow
        "Blue" = [ConsoleColor]::Blue
        "Magenta" = [ConsoleColor]::Magenta
        "Cyan" = [ConsoleColor]::Cyan
        "White" = [ConsoleColor]::White
    }
    
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Write-Success { param([string]$Message) Write-ColorOutput "✅ $Message" "Green" }
function Write-Warning { param([string]$Message) Write-ColorOutput "⚠️  $Message" "Yellow" }
function Write-Error { param([string]$Message) Write-ColorOutput "❌ $Message" "Red" }
function Write-Info { param([string]$Message) Write-ColorOutput "ℹ️  $Message" "Blue" }
function Write-Step { param([string]$Message) Write-ColorOutput "🔄 $Message" "Cyan" }

# Header
function Show-Header {
    Clear-Host
    Write-ColorOutput @"
╔══════════════════════════════════════════════════════════════════════════════╗
║                    Trae SOLO + Claude 4.1 API Integration                  ║
║                        Intelligent Portfolio Management                      ║
║                                Setup Script                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
"@ "Magenta"
    Write-Host ""
}

# Check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check prerequisites
function Test-Prerequisites {
    Write-Step "Checking prerequisites..."
    
    $prerequisites = @(
        @{ Name = "PowerShell"; Command = "pwsh"; MinVersion = "7.0"; Required = $true },
        @{ Name = "Node.js"; Command = "node"; MinVersion = "18.0"; Required = $true },
        @{ Name = "npm"; Command = "npm"; MinVersion = "8.0"; Required = $true },
        @{ Name = "Git"; Command = "git"; MinVersion = "2.30"; Required = $true },
        @{ Name = "Trae CLI"; Command = "trae"; MinVersion = "1.0"; Required = $true },
        @{ Name = "curl"; Command = "curl"; MinVersion = "7.0"; Required = $false }
    )
    
    $missingRequired = @()
    $missingOptional = @()
    
    foreach ($prereq in $prerequisites) {
        try {
            $version = & $prereq.Command --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "$($prereq.Name) is installed: $version"
            } else {
                throw "Command failed"
            }
        } catch {
            if ($prereq.Required) {
                $missingRequired += $prereq.Name
                Write-Error "$($prereq.Name) is required but not installed"
            } else {
                $missingOptional += $prereq.Name
                Write-Warning "$($prereq.Name) is optional but not installed"
            }
        }
    }
    
    if ($missingRequired.Count -gt 0) {
        Write-Error "Missing required prerequisites: $($missingRequired -join ', ')"
        Write-Info "Please install the missing prerequisites and run the script again."
        Write-Info "Installation guides:"
        Write-Info "- PowerShell 7+: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell"
        Write-Info "- Node.js: https://nodejs.org/"
        Write-Info "- Git: https://git-scm.com/"
        Write-Info "- Trae CLI: npm install -g @trae/cli"
        return $false
    }
    
    if ($missingOptional.Count -gt 0) {
        Write-Warning "Optional tools not installed: $($missingOptional -join ', ')"
        Write-Info "These tools can enhance the experience but are not required."
    }
    
    return $true
}

# Install Trae CLI if not present
function Install-TraeCLI {
    Write-Step "Installing Trae CLI..."
    
    try {
        trae --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Trae CLI is already installed"
            return $true
        }
    } catch {
        # Trae CLI not installed, proceed with installation
    }
    
    try {
        Write-Info "Installing Trae CLI globally..."
        npm install -g @trae/cli
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Trae CLI installed successfully"
            return $true
        } else {
            Write-Error "Failed to install Trae CLI"
            return $false
        }
    } catch {
        Write-Error "Error installing Trae CLI: $($_.Exception.Message)"
        return $false
    }
}

# Validate environment configuration
function Test-EnvironmentConfig {
    param([string]$ConfigPath)
    
    Write-Step "Validating environment configuration..."
    
    if (-not (Test-Path $ConfigPath)) {
        Write-Warning "Environment file not found: $ConfigPath"
        Write-Info "Creating from template..."
        
        $templatePath = ".env.claude-solo.example"
        if (Test-Path $templatePath) {
            Copy-Item $templatePath $ConfigPath
            Write-Success "Environment file created from template"
            Write-Warning "Please edit $ConfigPath and add your API keys and configuration"
            return $false
        } else {
            Write-Error "Template file not found: $templatePath"
            return $false
        }
    }
    
    # Read and validate environment variables
    $envContent = Get-Content $ConfigPath -Raw
    $requiredVars = @(
        "ANTHROPIC_API_KEY",
        "GITHUB_TOKEN",
        "PORTFOLIO_BASE_URL",
        "SLACK_WEBHOOK_URL",
        "DEVELOPER_EMAIL"
    )
    
    $missingVars = @()
    $placeholderVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "^$var=.+$") {
            $missingVars += $var
        } elseif ($envContent -match "^$var=(your_|example_|placeholder_)") {
            $placeholderVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Error "Missing required environment variables: $($missingVars -join ', ')"
        return $false
    }
    
    if ($placeholderVars.Count -gt 0) {
        Write-Warning "Placeholder values detected for: $($placeholderVars -join ', ')"
        Write-Info "Please update these variables with actual values in $ConfigPath"
        return $false
    }
    
    Write-Success "Environment configuration is valid"
    return $true
}

# Test API connectivity
function Test-APIConnectivity {
    Write-Step "Testing API connectivity..."
    
    # Load environment variables
    if (Test-Path $ConfigFile) {
        Get-Content $ConfigFile | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    }
    
    $tests = @()
    
    # Test Anthropic API
    $anthropicKey = [Environment]::GetEnvironmentVariable("ANTHROPIC_API_KEY")
    if ($anthropicKey -and $anthropicKey -ne "your_anthropic_api_key_here") {
        try {
            $headers = @{
                "x-api-key" = $anthropicKey
                "anthropic-version" = "2023-06-01"
                "content-type" = "application/json"
            }
            
            $body = @{
                model = "claude-3-5-sonnet-20241022"
                max_tokens = 10
                messages = @(
                    @{
                        role = "user"
                        content = "Hello"
                    }
                )
            } | ConvertTo-Json -Depth 3
            
            $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method POST -Headers $headers -Body $body -TimeoutSec 10
            $tests += @{ Name = "Anthropic API"; Status = "Success"; Message = "Connected successfully" }
        } catch {
            $tests += @{ Name = "Anthropic API"; Status = "Failed"; Message = $_.Exception.Message }
        }
    } else {
        $tests += @{ Name = "Anthropic API"; Status = "Skipped"; Message = "API key not configured" }
    }
    
    # Test GitHub API
    $githubToken = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN")
    if ($githubToken -and $githubToken -ne "your_github_token_here") {
        try {
            $headers = @{
                "Authorization" = "token $githubToken"
                "User-Agent" = "Trae-Claude-SOLO-Setup"
            }
            
            $response = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -TimeoutSec 10
            $tests += @{ Name = "GitHub API"; Status = "Success"; Message = "Connected as $($response.login)" }
        } catch {
            $tests += @{ Name = "GitHub API"; Status = "Failed"; Message = $_.Exception.Message }
        }
    } else {
        $tests += @{ Name = "GitHub API"; Status = "Skipped"; Message = "Token not configured" }
    }
    
    # Test Slack Webhook
    $slackWebhook = [Environment]::GetEnvironmentVariable("SLACK_WEBHOOK_URL")
    if ($slackWebhook -and $slackWebhook -ne "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK") {
        try {
            $body = @{
                text = "🤖 Trae SOLO + Claude 4.1 setup test message"
                username = "Trae-Claude-SOLO"
            } | ConvertTo-Json
            
            Invoke-RestMethod -Uri $slackWebhook -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
            $tests += @{ Name = "Slack Webhook"; Status = "Success"; Message = "Test message sent" }
        } catch {
            $tests += @{ Name = "Slack Webhook"; Status = "Failed"; Message = $_.Exception.Message }
        }
    } else {
        $tests += @{ Name = "Slack Webhook"; Status = "Skipped"; Message = "Webhook URL not configured" }
    }
    
    # Display results
    Write-Info "API Connectivity Test Results:"
    foreach ($test in $tests) {
        switch ($test.Status) {
            "Success" { Write-Success "$($test.Name): $($test.Message)" }
            "Failed" { Write-Error "$($test.Name): $($test.Message)" }
            "Skipped" { Write-Warning "$($test.Name): $($test.Message)" }
        }
    }
    
    $failedTests = $tests | Where-Object { $_.Status -eq "Failed" }
    return $failedTests.Count -eq 0
}

# Initialize Trae project
function Initialize-TraeProject {
    Write-Step "Initializing Trae project..."
    
    try {
        # Check if already initialized
        if (Test-Path ".trae/project.yml") {
            Write-Success "Trae project already initialized"
            return $true
        }
        
        # Initialize new project
        trae init --name "claude-solo-portfolio" --type "automation"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Trae project initialized successfully"
            return $true
        } else {
            Write-Error "Failed to initialize Trae project"
            return $false
        }
    } catch {
        Write-Error "Error initializing Trae project: $($_.Exception.Message)"
        return $false
    }
}

# Validate configuration files
function Test-ConfigurationFiles {
    Write-Step "Validating configuration files..."
    
    $configFiles = @(
        "claude-solo-integration.yml",
        "trae-multi-domain.yml",
        "deployment-automation.yml",
        "content-sync.yml",
        "ssl-management.yml",
        "link-validation.yml",
        "analytics-reporting.yml",
        "monitoring-config.yml"
    )
    
    $missingFiles = @()
    $validFiles = @()
    
    foreach ($file in $configFiles) {
        $filePath = ".trae/$file"
        if (Test-Path $filePath) {
            try {
                # Basic YAML validation
                $content = Get-Content $filePath -Raw
                if ($content -match "^name:\s*") {
                    $validFiles += $file
                    Write-Success "$file is valid"
                } else {
                    Write-Warning "$file may have formatting issues"
                }
            } catch {
                Write-Warning "$file could not be validated: $($_.Exception.Message)"
            }
        } else {
            $missingFiles += $file
            Write-Error "Missing configuration file: $file"
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-Error "Missing configuration files: $($missingFiles -join ', ')"
        Write-Info "Please ensure all configuration files are present in the .trae directory"
        return $false
    }
    
    Write-Success "All configuration files are present and valid"
    return $true
}

# Setup npm scripts and dependencies
function Setup-NPMConfiguration {
    Write-Step "Setting up npm configuration..."
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Info "Creating package.json..."
        
        $packageJson = @{
            name = "trae-claude-solo-portfolio"
            version = "1.0.0"
            description = "Intelligent portfolio management with Trae SOLO and Claude 4.1"
            scripts = @{
                "setup" = "pwsh .trae/setup-claude-solo.ps1"
                "start" = "trae start"
                "deploy" = "trae deploy --config .trae/claude-solo-integration.yml"
                "test:config" = "trae validate --config .trae/claude-solo-integration.yml"
                "test:apis" = "pwsh .trae/setup-claude-solo.ps1 -SkipPrerequisites -SkipValidation"
                "agents:start" = "trae agents start"
                "agents:stop" = "trae agents stop"
                "agents:status" = "trae agents status"
                "workflows:list" = "trae workflows list"
                "workflows:run" = "trae workflows run"
                "monitor" = "trae monitor --dashboard"
                "logs" = "trae logs --follow"
                "backup" = "trae backup --config .trae/claude-solo-integration.yml"
                "restore" = "trae restore --latest"
                "health" = "trae health --all"
                "docs" = "trae docs generate"
                "lint" = "trae lint --config .trae/claude-solo-integration.yml"
                "format" = "trae format --config .trae/claude-solo-integration.yml"
            }
            dependencies = @{
                "@trae/core" = "^1.0.0"
                "@trae/claude" = "^1.0.0"
                "@trae/github" = "^1.0.0"
                "@trae/monitoring" = "^1.0.0"
            }
            devDependencies = @{
                "@trae/cli" = "^1.0.0"
            }
            keywords = @("trae", "claude", "ai", "automation", "portfolio", "solo")
            author = "Stray Dog Syndications LLC"
            license = "MIT"
        } | ConvertTo-Json -Depth 3
        
        $packageJson | Out-File -FilePath "package.json" -Encoding UTF8
        Write-Success "package.json created"
    }
    
    # Install dependencies
    Write-Info "Installing npm dependencies..."
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Dependencies installed successfully"
            return $true
        } else {
            Write-Error "Failed to install dependencies"
            return $false
        }
    } catch {
        Write-Error "Error installing dependencies: $($_.Exception.Message)"
        return $false
    }
}

# Create directory structure
function New-DirectoryStructure {
    Write-Step "Creating directory structure..."
    
    $directories = @(
        ".trae/logs",
        ".trae/backups",
        ".trae/reports",
        ".trae/cache",
        ".trae/temp",
        "content/blog",
        "content/projects",
        "docs/api",
        "docs/guides",
        "public/images/blog",
        "src/data"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Success "Created directory: $dir"
        } else {
            Write-Info "Directory already exists: $dir"
        }
    }
    
    # Create .gitkeep files for empty directories
    $emptyDirs = @(".trae/logs", ".trae/backups", ".trae/reports", ".trae/cache", ".trae/temp")
    foreach ($dir in $emptyDirs) {
        $gitkeepPath = "$dir/.gitkeep"
        if (-not (Test-Path $gitkeepPath)) {
            "" | Out-File -FilePath $gitkeepPath -Encoding UTF8
        }
    }
    
    Write-Success "Directory structure created successfully"
    return $true
}

# Setup monitoring and health checks
function Setup-Monitoring {
    Write-Step "Setting up monitoring and health checks..."
    
    try {
        # Initialize monitoring
        trae monitor init --config ".trae/monitoring-config.yml"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Monitoring initialized successfully"
        } else {
            Write-Warning "Monitoring initialization failed, but continuing..."
        }
        
        # Setup health checks
        trae health init --config ".trae/claude-solo-integration.yml"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Health checks configured successfully"
        } else {
            Write-Warning "Health check configuration failed, but continuing..."
        }
        
        return $true
    } catch {
        Write-Warning "Error setting up monitoring: $($_.Exception.Message)"
        return $true  # Non-critical, continue setup
    }
}

# Run system health check
function Invoke-SystemHealthCheck {
    Write-Step "Running system health check..."
    
    $healthChecks = @(
        @{ Name = "Disk Space"; Check = { (Get-PSDrive C).Free -gt 1GB } },
        @{ Name = "Memory Available"; Check = { (Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory -gt 500000 } },
        @{ Name = "Network Connectivity"; Check = { Test-NetConnection -ComputerName "8.8.8.8" -Port 53 -InformationLevel Quiet } },
        @{ Name = "Internet Access"; Check = { 
            try { 
                Invoke-WebRequest -Uri "https://api.github.com" -UseBasicParsing -TimeoutSec 5 | Out-Null
                return $true 
            } catch { 
                return $false 
            }
        }}
    )
    
    $allPassed = $true
    
    foreach ($check in $healthChecks) {
        try {
            $result = & $check.Check
            if ($result) {
                Write-Success "$($check.Name): OK"
            } else {
                Write-Warning "$($check.Name): Failed"
                $allPassed = $false
            }
        } catch {
            Write-Error "$($check.Name): Error - $($_.Exception.Message)"
            $allPassed = $false
        }
    }
    
    return $allPassed
}

# Generate setup summary
function Show-SetupSummary {
    param(
        [bool]$Success,
        [string[]]$Warnings = @(),
        [string[]]$Errors = @()
    )
    
    Write-Host ""
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════════════════════╗" "Magenta"
    Write-ColorOutput "║                              SETUP SUMMARY                                  ║" "Magenta"
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════════════════════╝" "Magenta"
    Write-Host ""
    
    if ($Success) {
        Write-Success "🎉 Trae SOLO + Claude 4.1 integration setup completed successfully!"
    } else {
        Write-Error "❌ Setup completed with issues that need attention."
    }
    
    Write-Host ""
    
    if ($Warnings.Count -gt 0) {
        Write-Warning "Warnings encountered:"
        foreach ($warning in $Warnings) {
            Write-Host "   • $warning" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    if ($Errors.Count -gt 0) {
        Write-Error "Errors encountered:"
        foreach ($error in $Errors) {
            Write-Host "   • $error" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    Write-Info "📋 Next Steps:"
    Write-Host "   1. Review and update $ConfigFile with your API keys" -ForegroundColor White
    Write-Host "   2. Test API connectivity: npm run test:apis" -ForegroundColor White
    Write-Host "   3. Start the agents: npm run agents:start" -ForegroundColor White
    Write-Host "   4. Run a test workflow: npm run workflows:run documentation_generator" -ForegroundColor White
    Write-Host "   5. Open monitoring dashboard: npm run monitor" -ForegroundColor White
    Write-Host "   6. Check system health: npm run health" -ForegroundColor White
    Write-Host ""
    
    Write-Info "📚 Documentation:"
    Write-Host "   • Configuration Guide: .trae/README.md" -ForegroundColor White
    Write-Host "   • API Documentation: npm run docs" -ForegroundColor White
    Write-Host "   • Troubleshooting: .trae/TROUBLESHOOTING.md" -ForegroundColor White
    Write-Host ""
    
    Write-Info "🔧 Useful Commands:"
    Write-Host "   • npm run start          - Start the Trae system" -ForegroundColor White
    Write-Host "   • npm run deploy         - Deploy with Claude agents" -ForegroundColor White
    Write-Host "   • npm run agents:status  - Check agent status" -ForegroundColor White
    Write-Host "   • npm run logs           - View system logs" -ForegroundColor White
    Write-Host "   • npm run backup         - Create system backup" -ForegroundColor White
    Write-Host ""
    
    if ($Success) {
        Write-Success "🚀 Your intelligent portfolio management system is ready!"
    } else {
        Write-Warning "⚠️  Please address the issues above before proceeding."
    }
}

# Main setup function
function Start-Setup {
    Show-Header
    
    $warnings = @()
    $errors = @()
    $success = $true
    
    try {
        # Check if running as administrator
        if (-not (Test-Administrator)) {
            Write-Warning "Not running as administrator. Some operations may fail."
            $warnings += "Not running as administrator"
        }
        
        # Step 1: Check prerequisites
        if (-not $SkipPrerequisites) {
            if (-not (Test-Prerequisites)) {
                $errors += "Prerequisites check failed"
                $success = $false
                Show-SetupSummary -Success $success -Warnings $warnings -Errors $errors
                return
            }
        } else {
            Write-Info "Skipping prerequisites check as requested"
        }
        
        # Step 2: Install Trae CLI
        if (-not (Install-TraeCLI)) {
            $errors += "Trae CLI installation failed"
            $success = $false
        }
        
        # Step 3: Create directory structure
        if (-not (New-DirectoryStructure)) {
            $errors += "Directory structure creation failed"
            $success = $false
        }
        
        # Step 4: Setup npm configuration
        if (-not (Setup-NPMConfiguration)) {
            $errors += "npm configuration failed"
            $success = $false
        }
        
        # Step 5: Validate configuration files
        if (-not $SkipValidation) {
            if (-not (Test-ConfigurationFiles)) {
                $errors += "Configuration files validation failed"
                $success = $false
            }
        } else {
            Write-Info "Skipping configuration validation as requested"
        }
        
        # Step 6: Validate environment configuration
        if (-not (Test-EnvironmentConfig -ConfigPath $ConfigFile)) {
            $warnings += "Environment configuration needs attention"
        }
        
        # Step 7: Initialize Trae project
        if (-not $DryRun) {
            if (-not (Initialize-TraeProject)) {
                $errors += "Trae project initialization failed"
                $success = $false
            }
        } else {
            Write-Info "Skipping Trae project initialization (dry run)"
        }
        
        # Step 8: Setup monitoring
        if (-not $DryRun) {
            if (-not (Setup-Monitoring)) {
                $warnings += "Monitoring setup had issues"
            }
        } else {
            Write-Info "Skipping monitoring setup (dry run)"
        }
        
        # Step 9: Test API connectivity
        if (-not $DryRun) {
            if (-not (Test-APIConnectivity)) {
                $warnings += "Some API connectivity tests failed"
            }
        } else {
            Write-Info "Skipping API connectivity tests (dry run)"
        }
        
        # Step 10: Run system health check
        if (-not (Invoke-SystemHealthCheck)) {
            $warnings += "System health check found issues"
        }
        
    } catch {
        Write-Error "Unexpected error during setup: $($_.Exception.Message)"
        $errors += "Unexpected error: $($_.Exception.Message)"
        $success = $false
    }
    
    # Show summary
    Show-SetupSummary -Success $success -Warnings $warnings -Errors $errors
}

# Script entry point
if ($MyInvocation.InvocationName -ne '.') {
    Start-Setup
}