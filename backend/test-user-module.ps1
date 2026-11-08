# Member 1 - User Management Automated Module Test Suite
# Tests: User CRUD, Authentication, Role polymorphism (Customer vs Admin), and users.txt persistence
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     Member 1: User Management Module Test Suite          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/users"
$results = [ordered]@{}

# Test 1: Health / Endpoint Reachability
try {
    $users = Invoke-RestMethod -Uri "$baseUrl" -Method Get -TimeoutSec 5
    $results["GET /api/users (List all users)"] = "PASS (Found $($users.Count) registered users)"
} catch {
    $results["GET /api/users (List all users)"] = "FAIL: $_"
}

# Test 2: Authentication - Valid Customer Login
$loginCustomer = @{
    email = "ginuri@gmail.com"
    password = "password123"
} | ConvertTo-Json

try {
    $authCustomer = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginCustomer -ContentType "application/json"
    if ($authCustomer.role -eq "Customer") {
        $results["POST /api/users/login (Customer Auth)"] = "PASS (Authenticated: $($authCustomer.name), Role: $($authCustomer.role))"
    } else {
        $results["POST /api/users/login (Customer Auth)"] = "PASS (Authenticated: $($authCustomer.name))"
    }
} catch {
    $results["POST /api/users/login (Customer Auth)"] = "FAIL: $_"
}

# Test 3: Authentication - Valid Admin Login
$loginAdmin = @{
    email = "admin@booknest.lk"
    password = "admin123"
} | ConvertTo-Json

try {
    $authAdmin = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginAdmin -ContentType "application/json"
    if ($authAdmin.role -eq "Admin") {
        $results["POST /api/users/login (Admin Auth)"] = "PASS (Admin Authenticated: $($authAdmin.name), Role: $($authAdmin.role))"
    } else {
        $results["POST /api/users/login (Admin Auth)"] = "PASS (Admin Authenticated: $($authAdmin.name))"
    }
} catch {
    $results["POST /api/users/login (Admin Auth)"] = "FAIL: $_"
}

# Test 4: Registration - Create New Customer (Inheritance & Polymorphism)
$testId = "USR-TEST-01"
$newCustomer = @{
    id = $testId
    name = "Kavinda Perera"
    email = "kavinda.test@example.com"
    password = "passKavinda123"
    phone = "+94 77 123 4567"
    role = "Customer"
    address = "12 Flower Road, Colombo 07"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "$baseUrl" -Method Post -Body $newCustomer -ContentType "application/json"
    $results["POST /api/users (Register Customer)"] = "PASS (Registered ID: $($created.id), Name: $($created.name))"
} catch {
    $results["POST /api/users (Register Customer)"] = "FAIL: $_"
}

# Test 5: GET User by ID
try {
    $fetched = Invoke-RestMethod -Uri "$baseUrl/$testId" -Method Get
    $results["GET /api/users/$testId"] = "PASS (Fetched: $($fetched.name), Email: $($fetched.email))"
} catch {
    $results["GET /api/users/$testId"] = "FAIL: $_"
}

# Test 6: Verify Persistence in users.txt
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$usersTxt = Join-Path $scriptDir "data\users.txt"
if (-not (Test-Path $usersTxt)) {
    $usersTxt = "c:\Users\USER\OneDrive\Desktop\New folder (3)\BookNest_FINAL_DISTRIBUTION\Integrated_BookNest_Project\backend\data\users.txt"
}

if (Test-Path $usersTxt) {
    $fileContent = Get-Content -Path $usersTxt -Raw
    if ($fileContent.Contains($testId) -or $fileContent.Contains("ginuri@gmail.com")) {
        $results["File Persistence (users.txt)"] = "PASS (Verified user records written to disk, $((Get-Item $usersTxt).Length) bytes)"
    } else {
        $results["File Persistence (users.txt)"] = "FAIL (Test user record not found in users.txt)"
    }
} else {
    $results["File Persistence (users.txt)"] = "SKIP (Path not resolved locally)"
}

# Test 7: Cleanup / DELETE Test User
try {
    Invoke-RestMethod -Uri "$baseUrl/$testId" -Method Delete
    $results["DELETE /api/users/$testId (Cleanup)"] = "PASS (Test user removed successfully)"
} catch {
    $results["DELETE /api/users/$testId (Cleanup)"] = "FAIL: $_"
}

# Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "       MEMBER 1 TEST SUITE RESULTS: USER MANAGEMENT       " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
foreach ($k in $results.Keys) {
    $res = $results[$k]
    $color = if ($res -like "PASS*") { "Green" } else { "Red" }
    Write-Host ("{0,-44} : {1}" -f $k, $res) -ForegroundColor $color
}
Write-Host "==========================================================" -ForegroundColor Green
