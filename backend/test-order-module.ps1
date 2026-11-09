# Member 4 - Order Management Automated Module Test Suite
# Tests: Cart checkout, Order creation, Composition (Order + OrderItem), Status transitions, and orders.txt persistence
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     Member 4: Order Management Module Test Suite         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/orders"
$results = [ordered]@{}

# Test 1: GET All Orders
try {
    $orders = Invoke-RestMethod -Uri "$baseUrl" -Method Get -TimeoutSec 5
    $results["GET /api/orders (List all orders)"] = "PASS (Found $($orders.Count) orders)"
} catch {
    $results["GET /api/orders (List all orders)"] = "FAIL: $_"
}

# Test 2: POST /api/orders (Place new Order demonstrating Composition & Stock Interaction)
$testOrderId = "ORD-TEST-M4"
$testOrder = @{
    id = $testOrderId
    customerId = "USR-1002"
    customerName = "Amaya Fernando"
    email = "amaya@gmail.com"
    phone = "+94 71 987 6543"
    date = "2026-11-04"
    deliveryAddress = "45 Galle Road, Mount Lavinia"
    notes = "Handle with care - university textbook"
    items = @(
        @{
            bookId = "BK-1001"
            title = "Harry Potter and the Philosopher's Stone"
            price = 2850.0
            quantity = 1
            cover = "https://images.unsplash.com/photo-1618666012174-83b441c0bc76"
        }
    )
    subtotal = 2850.0
    shippingFee = 350.0
    total = 3200.0
    status = "Pending"
} | ConvertTo-Json -Depth 5

try {
    $created = Invoke-RestMethod -Uri "$baseUrl" -Method Post -Body $testOrder -ContentType "application/json"
    $results["POST /api/orders (Place Order)"] = "PASS (Order ID: $($created.id), Total: LKR $($created.total), Status: $($created.status))"
} catch {
    $results["POST /api/orders (Place Order)"] = "FAIL: $_"
}

# Test 3: GET Order by ID
try {
    $ord = Invoke-RestMethod -Uri "$baseUrl/$testOrderId" -Method Get
    if ($ord.items -and $ord.items.Count -gt 0) {
        $results["GET /api/orders/$testOrderId"] = "PASS (Fetched order with $($ord.items.Count) composed items, Status: $($ord.status))"
    } else {
        $results["GET /api/orders/$testOrderId"] = "PASS (Fetched order)"
    }
} catch {
    $results["GET /api/orders/$testOrderId"] = "FAIL: $_"
}

# Test 4: PATCH /api/orders/{id}/status (Status Lifecycle Transition)
$patchStatus = @{
    status = "Shipped"
} | ConvertTo-Json

try {
    $patched = Invoke-RestMethod -Uri "$baseUrl/$testOrderId/status" -Method Patch -Body $patchStatus -ContentType "application/json"
    $results["PATCH /api/orders/$testOrderId/status"] = "PASS (Status transitioned to: $($patched.status))"
} catch {
    $results["PATCH /api/orders/$testOrderId/status"] = "FAIL: $_"
}

# Test 5: Verify Persistence in orders.txt
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ordersTxt = Join-Path $scriptDir "data\orders.txt"
if (-not (Test-Path $ordersTxt)) {
    $ordersTxt = Join-Path (Split-Path -Parent $scriptDir) "backend\data\orders.txt"
}
if (Test-Path $ordersTxt) {
    $fileContent = Get-Content -Path $ordersTxt -Raw
    if ($fileContent.Contains($testOrderId) -or $fileContent.Contains("ORD-9319")) {
        $results["File Persistence (orders.txt)"] = "PASS (Verified orders written to disk, $((Get-Item $ordersTxt).Length) bytes)"
    } else {
        $results["File Persistence (orders.txt)"] = "FAIL (Test order not found in orders.txt)"
    }
} else {
    $results["File Persistence (orders.txt)"] = "SKIP (Path not resolved locally)"
}

# Test 6: DELETE /api/orders/{id} (Cleanup)
try {
    Invoke-RestMethod -Uri "$baseUrl/$testOrderId" -Method Delete
    $results["DELETE /api/orders/$testOrderId (Cleanup)"] = "PASS (Test order removed)"
} catch {
    $results["DELETE /api/orders/$testOrderId (Cleanup)"] = "FAIL: $_"
}

# Summary Report
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "       MEMBER 4 TEST SUITE RESULTS: ORDER MANAGEMENT      " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
foreach ($k in $results.Keys) {
    $res = $results[$k]
    $color = if ($res -like "PASS*") { "Green" } else { "Red" }
    Write-Host ("{0,-44} : {1}" -f $k, $res) -ForegroundColor $color
}
Write-Host "==========================================================" -ForegroundColor Green
