# setup.ps1
# Privacy Policy TL;DR - ToS;DR Data Extractor Setup v2
# =====================================================
# Git clone不要！APIから直接データを取得します
# PowerShellで実行: .\setup.ps1

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Privacy Policy TL;DR - Setup v2" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ToS;DR APIからデータを取得します（Git clone不要）" -ForegroundColor Gray
Write-Host ""

# Step 1: Pythonのバージョン確認
Write-Host "[1/3] Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  OK: $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Python not found" -ForegroundColor Red
    Write-Host "  Please install Python: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Step 2: requestsパッケージの確認（オプション）
Write-Host ""
Write-Host "[2/3] Checking requests package (optional)..." -ForegroundColor Yellow
$hasRequests = python -c "import requests" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  INFO: requests not installed, using urllib (built-in)" -ForegroundColor Gray
    Write-Host "  TIP: For better performance, run: pip install requests" -ForegroundColor Gray
} else {
    Write-Host "  OK: requests package found" -ForegroundColor Green
}

# Step 3: Pythonスクリプトを実行
Write-Host ""
Write-Host "[3/3] Fetching data from ToS;DR API..." -ForegroundColor Yellow
Write-Host "  This may take 1-2 minutes..." -ForegroundColor Gray
Write-Host ""
python extract_patterns.py

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Extraction failed" -ForegroundColor Red
    exit 1
}

# 結果を確認
Write-Host ""
if (Test-Path "privacy-patterns.json") {
    $fileSize = (Get-Item "privacy-patterns.json").Length / 1KB
    $fileSizeRounded = [math]::Round($fileSize, 1)
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "Setup Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Generated: privacy-patterns.json ($fileSizeRounded KB)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step:" -ForegroundColor Yellow
    Write-Host "  Copy-Item privacy-patterns.json ..\app\lib\" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "  ERROR: File not generated" -ForegroundColor Red
    exit 1
}