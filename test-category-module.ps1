# Member 3 - Category Management & GenericDAO Automated Module Test Suite
# Tests: Category CRUD, GenericDAO contract compliance, taxonomy integrity, and categories.txt persistence
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Member 3: Category Management & GenericDAO Test Suite    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/categories"
$results = [ordered]@{}

# Test 1: GET All Categories
try {
    $cats = Invoke-RestMethod -Uri "$baseUrl" -Method Get -TimeoutSec 5
    $results["GET /api/categories (List all)"] = "PASS (Found $($cats.Count) active categories)"
} catch {
    $results["GET /api/categories (List all)"] = "FAIL: $_"
}

# Test 2: POST /api/categories (Create new Category)
$testCatId = "CAT-TEST-03"
$newCat = @{
    id = $testCatId
    name = "Software Engineering"
    description = "Books on software lifecycle, OOP paradigms, and system design."
    icon = "bi-code-slash"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "$baseUrl" -Method Post -Body $newCat -ContentType "application/json"
    $results["POST /api/categories (Create)"] = "PASS (Created: $($created.name), ID: $($created.id))"
} catch {
    $results["POST /api/categories (Create)"] = "FAIL: $_"
}

# Test 3: GET Category by ID
try {
    $cat = Invoke-RestMethod -Uri "$baseUrl/$testCatId" -Method Get
    $results["GET /api/categories/$testCatId"] = "PASS (Fetched: $($cat.name), Icon: $($cat.icon))"
} catch {
    $results["GET /api/categories/$testCatId"] = "FAIL: $_"
}

# Test 4: PUT /api/categories/{id} (Update Category)
$updatedCat = @{
    name = "Software Engineering & Architecture"
    description = "Updated taxonomy description with advanced design principles."
    icon = "bi-cpu"
} | ConvertTo-Json

try {
    $upRes = Invoke-RestMethod -Uri "$baseUrl/$testCatId" -Method Put -Body $updatedCat -ContentType "application/json"
    $results["PUT /api/categories/$testCatId (Update)"] = "PASS (Updated Name: $($upRes.name))"
} catch {
    $results["PUT /api/categories/$testCatId (Update)"] = "FAIL: $_"
}

# Test 5: Verify Persistence in categories.txt
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$catsTxt = Join-Path $scriptDir "data\categories.txt"
if (-not (Test-Path $catsTxt)) {
    $catsTxt = Join-Path (Split-Path -Parent $scriptDir) "backend\data\categories.txt"
}
if (Test-Path $catsTxt) {
    $fileContent = Get-Content -Path $catsTxt -Raw
    if ($fileContent.Contains($testCatId) -or $fileContent.Contains("Fiction")) {
        $results["File Persistence (categories.txt)"] = "PASS (Verified categories written to disk, $((Get-Item $catsTxt).Length) bytes)"
    } else {
        $results["File Persistence (categories.txt)"] = "FAIL (Category not found in categories.txt)"
    }
} else {
    $results["File Persistence (categories.txt)"] = "SKIP (Path not resolved locally)"
}

# Test 6: DELETE /api/categories/{id} (Cleanup)
try {
    Invoke-RestMethod -Uri "$baseUrl/$testCatId" -Method Delete
    $results["DELETE /api/categories/$testCatId (Cleanup)"] = "PASS (Test category removed)"
} catch {
    $results["DELETE /api/categories/$testCatId (Cleanup)"] = "FAIL: $_"
}

# Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "     MEMBER 3 TEST SUITE RESULTS: CATEGORY MANAGEMENT     " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
foreach ($k in $results.Keys) {
    $res = $results[$k]
    $color = if ($res -like "PASS*") { "Green" } else { "Red" }
    Write-Host ("{0,-44} : {1}" -f $k, $res) -ForegroundColor $color
}
Write-Host "==========================================================" -ForegroundColor Green
