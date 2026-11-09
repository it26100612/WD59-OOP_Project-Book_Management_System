# BookNest Java Backend Launcher (PowerShell)
$Host.UI.RawUI.WindowTitle = "BookNest Java Backend Server"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting BookNest Java Spring Boot Backend Server     " -ForegroundColor Cyan
Write-Host "  Storage: Plain Text Files (./data/*.txt) - NO SQL     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"
$toolsMaven = Join-Path $PSScriptRoot "tools\apache-maven-3.9.6\bin"
$env:PATH = "$env:JAVA_HOME\bin;$toolsMaven;" + $env:PATH

# 2. Check Maven
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvnCmd) {
    Write-Host ""
    Write-Host "[ERROR] Apache Maven was not found in PATH or backend\tools\" -ForegroundColor Red
    Write-Host "Would you like to download portable Maven automatically? (Y/N)" -ForegroundColor Yellow
    $ans = Read-Host
    if ($ans -eq "Y" -or $ans -eq "y") {
        & (Join-Path $PSScriptRoot "setup-maven.ps1")
        $env:PATH = "$env:JAVA_HOME\bin;$toolsMaven;" + $env:PATH
    } else {
        Write-Host "Aborted. Install Maven or run backend\setup-maven.ps1 when ready." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "[OK] Using Java JDK: $env:JAVA_HOME" -ForegroundColor Green
mvn -version

Write-Host ""
Write-Host ">>> Compiling and starting Spring Boot..." -ForegroundColor Cyan
mvn spring-boot:run
