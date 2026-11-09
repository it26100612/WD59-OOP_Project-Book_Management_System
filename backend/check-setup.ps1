# BookNest Environment Setup Checker
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   BookNest Java Backend Environment Check       " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Check Java JDK
$javaPath = "C:\Program Files\Java\jdk-26"
if (Test-Path $javaPath) {
    Write-Host "[OK] Java JDK found at: $javaPath" -ForegroundColor Green
    $env:JAVA_HOME = $javaPath
    Write-Host "[OK] JAVA_HOME set to: $env:JAVA_HOME for this session" -ForegroundColor Green
} else {
    Write-Host "[!] JDK not found at default location. Checking PATH..." -ForegroundColor Yellow
}

# Check java and javac
try {
    $javaVer = & "C:\Program Files\Java\jdk-26\bin\java.exe" -version 2>&1 | Select-Object -First 1
    Write-Host "[OK] Java Runtime: $javaVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Could not run java.exe" -ForegroundColor Red
}

try {
    $javacVer = & "C:\Program Files\Java\jdk-26\bin\javac.exe" -version 2>&1
    Write-Host "[OK] Java Compiler: $javacVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Could not run javac.exe" -ForegroundColor Red
}

# 2. Check Maven
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnCmd) {
    $mvnVer = & mvn -version | Select-Object -First 1
    Write-Host "[OK] Apache Maven found: $mvnVer" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ATTENTION] Apache Maven is not yet in your system PATH." -ForegroundColor Yellow
    Write-Host "To install Apache Maven on Windows:" -ForegroundColor Cyan
    Write-Host "  Option 1: Open PowerShell as Administrator and run:" -ForegroundColor White
    Write-Host "            winget install Apache.Maven" -ForegroundColor Yellow
    Write-Host "  Option 2: Download official zip from https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "            Extract to C:\Program Files\apache-maven and add the bin folder to PATH." -ForegroundColor White
}

Write-Host "=================================================" -ForegroundColor Cyan
