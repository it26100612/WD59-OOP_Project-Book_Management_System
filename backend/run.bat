@echo off
title BookNest Java Backend Server
echo ========================================================
echo   Starting BookNest Java Spring Boot Backend Server     
echo   Storage: Plain Text Files (./data/*.txt) - NO SQL     
echo ========================================================

:: 1. Set JAVA_HOME if not already set
if "%JAVA_HOME%"=="" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-26"
)

:: 2. Check if Maven is available in PATH or portable tools folder
set "PATH=%JAVA_HOME%\bin;%~dp0tools\apache-maven-3.9.6\bin;%PATH%"

where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Maven is not installed in PATH or tools directory.
    echo.
    echo Please run the following command in PowerShell to download portable Maven:
    echo     powershell -ExecutionPolicy Bypass -File "%~dp0setup-maven.ps1"
    echo.
    echo Or install Maven globally via:
    echo     winget install Apache.Maven
    echo.
    pause
    exit /b 1
)

echo [OK] Using Java at: %JAVA_HOME%
mvn -version
echo.
echo Compiling and starting BookNest Spring Boot application...
mvn spring-boot:run
pause
