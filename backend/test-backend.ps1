# BookNest Backend Automated Test Suite
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    BookNest Spring Boot Backend Automated Test Suite     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Program Files\Java\jdk-26"
$mavenBin = Join-Path $PSScriptRoot "tools\apache-maven-3.9.6\bin\mvn.cmd"
$pomPath = Join-Path $PSScriptRoot "pom.xml"

# Clean old data files to test auto-seeding
$dataDir = Join-Path $PSScriptRoot "data"
if (Test-Path $dataDir) {
    Remove-Item -Path "$dataDir\*.txt" -Force -ErrorAction SilentlyContinue
}

# 1. Start Server Process
Write-Host ">>> Starting Spring Boot Server in background..." -ForegroundColor Yellow
$proc = Start-Process -FilePath $mavenBin -ArgumentList "-f `"$pomPath`" spring-boot:run" -PassThru -NoNewWindow

# Wait for server to come online
$serverReady = $false
$baseUrl = "http://localhost:8080"
$timeoutSeconds = 40
$elapsed = 0

while (-not $serverReady -and $elapsed -lt $timeoutSeconds) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/api/books" -Method Get -TimeoutSec 2 -ErrorAction Stop
        if ($res -and $res.Count -gt 0) {
            $serverReady = $true
            Write-Host "[OK] Server is UP and responding after $elapsed seconds!" -ForegroundColor Green
        }
    } catch {
        Write-Host "    Waiting for server to start... ($elapsed s)" -ForegroundColor Gray
    }
}

if (-not $serverReady) {
    Write-Host "[ERROR] Server failed to start within $timeoutSeconds seconds." -ForegroundColor Red
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    exit 1
}

$results = [ordered]@{}

# Test 0: GET /api/health
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    $results["GET /api/health"] = "PASS (Status: $($health.status), App: $($health.application))"
} catch {
    $results["GET /api/health"] = "FAIL: $_"
}

# Test 1: GET /api/books
try {
    $books = Invoke-RestMethod -Uri "$baseUrl/api/books" -Method Get
    $results["GET /api/books"] = "PASS (Found $($books.Count) books)"
} catch {
    $results["GET /api/books"] = "FAIL: $_"
}

# Test 2: POST /api/books (Create new book)
$newBook = @{
    id = "BK-TEST-999"
    title = "Test Driven Java OOP"
    author = "SE1020 Team"
    category = "Technology"
    isbn = "978-0000000001"
    price = 4500
    quantity = 10
} | ConvertTo-Json

try {
    $createdBook = Invoke-RestMethod -Uri "$baseUrl/api/books" -Method Post -Body $newBook -ContentType "application/json"
    $results["POST /api/books"] = "PASS (Created: $($createdBook.title))"
} catch {
    $results["POST /api/books"] = "FAIL: $_"
}

# Test 3: PUT /api/books (Update book)
$updatedBook = @{
    title = "Test Driven Java OOP (2nd Edition)"
    author = "SE1020 Team"
    category = "Technology"
    isbn = "978-0000000001"
    price = 4800
    quantity = 15
} | ConvertTo-Json

try {
    $upRes = Invoke-RestMethod -Uri "$baseUrl/api/books/BK-TEST-999" -Method Put -Body $updatedBook -ContentType "application/json"
    $results["PUT /api/books/BK-TEST-999"] = "PASS (Updated price: $($upRes.price))"
} catch {
    $results["PUT /api/books/BK-TEST-999"] = "FAIL: $_"
}

# Test 4: DELETE /api/books (Delete book)
try {
    Invoke-RestMethod -Uri "$baseUrl/api/books/BK-TEST-999" -Method Delete
    $results["DELETE /api/books/BK-TEST-999"] = "PASS"
} catch {
    $results["DELETE /api/books/BK-TEST-999"] = "FAIL: $_"
}

# Test 5: GET /api/categories
try {
    $cats = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method Get
    $results["GET /api/categories"] = "PASS (Found $($cats.Count) categories)"
} catch {
    $results["GET /api/categories"] = "FAIL: $_"
}

# Test 6: GET /api/users
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get
    $results["GET /api/users"] = "PASS (Found $($users.Count) users)"
} catch {
    $results["GET /api/users"] = "FAIL: $_"
}

# Test 7: POST /api/orders (Checkout & Stock Deduction)
$testOrder = @{
    id = "ORD-TEST-100"
    customerId = "USR-1002"
    customerName = "Amaya Fernando"
    email = "amaya@gmail.com"
    phone = "+94 71 987 6543"
    date = "2026-10-27"
    deliveryAddress = "45 Galle Road, Mount Lavinia"
    items = @(
        @{
            bookId = "BK-1001"
            title = "Harry Potter and the Philosopher's Stone"
            price = 2850
            quantity = 2
            cover = "https://images.unsplash.com/photo-1618666012174-83b441c0bc76"
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $orderRes = Invoke-RestMethod -Uri "$baseUrl/api/orders" -Method Post -Body $testOrder -ContentType "application/json"
    $results["POST /api/orders"] = "PASS (Total: $($orderRes.total), Status: $($orderRes.status))"
} catch {
    $results["POST /api/orders"] = "FAIL: $_"
}

# Test 8: GET /api/reviews
try {
    $reviews = Invoke-RestMethod -Uri "$baseUrl/api/reviews" -Method Get
    $results["GET /api/reviews"] = "PASS (Found $($reviews.Count) reviews)"
} catch {
    $results["GET /api/reviews"] = "FAIL: $_"
}

# Verify persistent text files on disk
Write-Host "`n>>> Verifying Persistent Text Files in backend\data\..." -ForegroundColor Cyan
$files = Get-ChildItem -Path $dataDir -Filter "*.txt" -ErrorAction SilentlyContinue

$fileStatus = @{}
foreach ($f in $files) {
    $fileStatus[$f.Name] = "$($f.Length) bytes"
}

# Stop the server process cleanly
Write-Host "`n>>> Stopping Spring Boot server test process..." -ForegroundColor Yellow
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue

# Ensure all spawned java processes from this run are terminated
Get-Process -Name "java", "javaw" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Output Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "                TEST SUITE SUMMARY RESULTS                " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
foreach ($key in $results.Keys) {
    $val = $results[$key]
    $color = if ($val -like "PASS*") { "Green" } else { "Red" }
    Write-Host ("{0,-35} : {1}" -f $key, $val) -ForegroundColor $color
}

Write-Host "`nPersistent Text Files on Disk:" -ForegroundColor Cyan
foreach ($k in $fileStatus.Keys) {
    Write-Host ("  - {0,-20} ({1})" -f $k, $fileStatus[$k]) -ForegroundColor Green
}
Write-Host "==========================================================" -ForegroundColor Green
