# Automated Portable Maven Downloader for BookNest Backend
# This script downloads a portable copy of Apache Maven into backend\tools\
# so you don't have to manually configure Windows PATH or install anything globally.

$ErrorActionPreference = "Stop"

Write-Host ">>> Checking Java environment..." -ForegroundColor Cyan
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH

$toolsDir = Join-Path $PSScriptRoot "tools"
$mavenDir = Join-Path $toolsDir "apache-maven-3.9.6"
$zipFile = Join-Path $toolsDir "maven.zip"

if (Test-Path "$mavenDir\bin\mvn.cmd") {
    Write-Host "[OK] Portable Maven already installed at: $mavenDir" -ForegroundColor Green
    & "$mavenDir\bin\mvn.cmd" -version
    exit 0
}

Write-Host ">>> Creating tools directory at $toolsDir..." -ForegroundColor Cyan
if (!(Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
Write-Host ">>> Downloading portable Apache Maven 3.9.6 from official mirror..." -ForegroundColor Cyan
Write-Host "    URL: $mavenUrl" -ForegroundColor Gray

Invoke-WebRequest -Uri $mavenUrl -OutFile $zipFile

Write-Host ">>> Extracting Maven archive..." -ForegroundColor Cyan
Expand-Archive -Path $zipFile -DestinationPath $toolsDir -Force

if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}

Write-Host "[SUCCESS] Portable Apache Maven is ready at: $mavenDir" -ForegroundColor Green
& "$mavenDir\bin\mvn.cmd" -version
