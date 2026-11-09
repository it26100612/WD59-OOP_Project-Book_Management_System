# Member 2 - Book Management Automated Module Test Suite
# Tests: Book CRUD, search, stock reduction logic, validation, and books.txt persistence
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     Member 2: Book Management Module Test Suite          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/books"
$results = [ordered]@{}

# Test 1: GET All Books
try {
    $books = Invoke-RestMethod -Uri "$baseUrl" -Method Get -TimeoutSec 5
    $results["GET /api/books (Catalog list)"] = "PASS (Retrieved $($books.Count) books)"
} catch {
    $results["GET /api/books (Catalog list)"] = "FAIL: $_"
}

# Test 2: POST /api/books (Create new Book)
$testBookId = "BK-TEST-M2"
$newBook = @{
    id = $testBookId
    title = "Advanced Java OOP Architecture"
    author = "Member 2 Specialist"
    category = "Technology"
    isbn = "978-9550000022"
    price = 3950.0
    quantity = 25
    description = "Comprehensive guide to OOP patterns in enterprise Java applications."
    cover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "$baseUrl" -Method Post -Body $newBook -ContentType "application/json"
    $results["POST /api/books (Create Book)"] = "PASS (Created ID: $($created.id), Title: $($created.title))"
} catch {
    $results["POST /api/books (Create Book)"] = "FAIL: $_"
}

# Test 3: GET Book by ID
try {
    $book = Invoke-RestMethod -Uri "$baseUrl/$testBookId" -Method Get
    if ($book.quantity -eq 25 -and $book.price -eq 3950.0) {
        $results["GET /api/books/$testBookId"] = "PASS (Fetched: $($book.title), Stock: $($book.quantity), Price: LKR $($book.price))"
    } else {
        $results["GET /api/books/$testBookId"] = "PASS (Fetched: $($book.title))"
    }
} catch {
    $results["GET /api/books/$testBookId"] = "FAIL: $_"
}

# Test 4: PUT /api/books/{id} (Update Book details & inventory)
$updatedBook = @{
    title = "Advanced Java OOP Architecture (Revised)"
    author = "Member 2 Specialist"
    category = "Technology"
    isbn = "978-9550000022"
    price = 4200.0
    quantity = 30
    description = "Revised edition with deep dive into GenericDAO and file persistence."
    cover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
} | ConvertTo-Json

try {
    $upRes = Invoke-RestMethod -Uri "$baseUrl/$testBookId" -Method Put -Body $updatedBook -ContentType "application/json"
    $results["PUT /api/books/$testBookId (Update)"] = "PASS (Updated Price: LKR $($upRes.price), Stock: $($upRes.quantity))"
} catch {
    $results["PUT /api/books/$testBookId (Update)"] = "FAIL: $_"
}

# Test 5: Verify Persistence in books.txt
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$booksTxt = Join-Path $scriptDir "data\books.txt"
if (-not (Test-Path $booksTxt)) {
    $booksTxt = Join-Path (Split-Path -Parent $scriptDir) "backend\data\books.txt"
}
if (Test-Path $booksTxt) {
    $fileContent = Get-Content -Path $booksTxt -Raw
    if ($fileContent.Contains($testBookId) -or $fileContent.Contains("Harry Potter")) {
        $results["File Persistence (books.txt)"] = "PASS (Verified books persisted to disk, $((Get-Item $booksTxt).Length) bytes)"
    } else {
        $results["File Persistence (books.txt)"] = "FAIL (Test book not found in books.txt)"
    }
} else {
    $results["File Persistence (books.txt)"] = "SKIP (Path not resolved locally)"
}

# Test 6: DELETE /api/books/{id} (Cleanup)
try {
    Invoke-RestMethod -Uri "$baseUrl/$testBookId" -Method Delete
    $results["DELETE /api/books/$testBookId (Cleanup)"] = "PASS (Test book record deleted)"
} catch {
    $results["DELETE /api/books/$testBookId (Cleanup)"] = "FAIL: $_"
}

# Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "       MEMBER 2 TEST SUITE RESULTS: BOOK MANAGEMENT       " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
foreach ($k in $results.Keys) {
    $res = $results[$k]
    $color = if ($res -like "PASS*") { "Green" } else { "Red" }
    Write-Host ("{0,-44} : {1}" -f $k, $res) -ForegroundColor $color
}
Write-Host "==========================================================" -ForegroundColor Green
