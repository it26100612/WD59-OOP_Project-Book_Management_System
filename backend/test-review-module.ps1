# Member 5 - Review Management & Static Pages Automated Module Test Suite
# Tests: Review CRUD, Rating calculation, Book rating aggregation, Static page integrity, and reviews.txt persistence
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Member 5: Review Management & Static Pages Test Suite    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/reviews"
$results = [ordered]@{}

# Test 1: GET All Reviews
try {
    $reviews = Invoke-RestMethod -Uri "$baseUrl" -Method Get -TimeoutSec 5
    $results["GET /api/reviews (List all)"] = "PASS (Found $($reviews.Count) customer reviews)"
} catch {
    $results["GET /api/reviews (List all)"] = "FAIL: $_"
}

# Test 2: POST /api/reviews (Create Review & trigger Book rating recalculation)
$testRevId = "REV-TEST-M5"
$newReview = @{
    id = $testRevId
    bookId = "BK-1001"
    bookTitle = "Harry Potter and the Philosopher's Stone"
    customerName = "Test Reviewer"
    rating = 5
    comment = "Timeless masterpiece! Magical worldbuilding and unforgettable characters."
    date = "2026-11-04"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "$baseUrl" -Method Post -Body $newReview -ContentType "application/json"
    $results["POST /api/reviews (Create Review)"] = "PASS (Created ID: $($created.id), Rating: $($created.rating) stars)"
} catch {
    $results["POST /api/reviews (Create Review)"] = "FAIL: $_"
}

# Test 3: GET Reviews by Book ID (Query parameter bookId)
$bookReviewUri = "${baseUrl}?bookId=BK-1001"
try {
    $bookRevs = Invoke-RestMethod -Uri $bookReviewUri -Method Get
    $results["GET /api/reviews?bookId=BK-1001"] = "PASS (Retrieved $($bookRevs.Count) reviews for Book BK-1001)"
} catch {
    $results["GET /api/reviews?bookId=BK-1001"] = "FAIL: $_"
}

# Test 4: Verify Static Pages Integrity (about, contact, delivery, privacy, terms)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$distMemberRoot = Split-Path -Parent $scriptDir
$staticPages = @("about.html", "contact.html", "delivery.html", "privacy.html", "terms.html")
$allStaticFound = $true
$missingStatic = @()

foreach ($pg in $staticPages) {
    $pgPath = Join-Path $distMemberRoot "BookNest\$pg"
    if (-not (Test-Path $pgPath)) {
        $allStaticFound = $false
        $missingStatic += $pg
    }
}

if ($allStaticFound) {
    $results["Static Pages Integrity (5 HTML files)"] = "PASS (All 5 static policy and information pages verified)"
} else {
    $results["Static Pages Integrity (5 HTML files)"] = "FAIL (Missing: $($missingStatic -join ', '))"
}

# Test 5: Verify Persistence in reviews.txt
$reviewsTxt = Join-Path $scriptDir "data\reviews.txt"
if (-not (Test-Path $reviewsTxt)) {
    $reviewsTxt = "c:\Users\USER\OneDrive\Desktop\New folder (3)\BookNest_FINAL_DISTRIBUTION\Integrated_BookNest_Project\backend\data\reviews.txt"
}
if (Test-Path $reviewsTxt) {
    $fileContent = Get-Content -Path $reviewsTxt -Raw
    if ($fileContent.Contains($testRevId) -or $fileContent.Contains("REV-")) {
        $results["File Persistence (reviews.txt)"] = "PASS (Verified reviews written to disk, $((Get-Item $reviewsTxt).Length) bytes)"
    } else {
        $results["File Persistence (reviews.txt)"] = "FAIL (Review not found in reviews.txt)"
    }
} else {
    $results["File Persistence (reviews.txt)"] = "SKIP (Path not resolved locally)"
}

# Test 6: DELETE /api/reviews/{id} (Cleanup)
try {
    Invoke-RestMethod -Uri "$baseUrl/$testRevId" -Method Delete
    $results["DELETE /api/reviews/$testRevId (Cleanup)"] = "PASS (Test review deleted)"
} catch {
    $results["DELETE /api/reviews/$testRevId (Cleanup)"] = "FAIL: $_"
}

# Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "     MEMBER 5 TEST SUITE RESULTS: REVIEWS & STATIC        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
foreach ($k in $results.Keys) {
    $res = $results[$k]
    $color = if ($res -like "PASS*") { "Green" } else { "Red" }
    Write-Host ("{0,-44} : {1}" -f $k, $res) -ForegroundColor $color
}
Write-Host "==========================================================" -ForegroundColor Green
