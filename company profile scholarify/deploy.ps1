# PowerShell script deployment helper untuk Scholarify Frontend (Next.js)

Write-Host "🚀 Scholarify Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json tidak ditemukan!" -ForegroundColor Red
    Write-Host "   Pastikan Anda berada di folder 'company profile scholarify'" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Host "❌ Error: Node.js version harus 18 atau lebih tinggi" -ForegroundColor Red
    Write-Host "   Versi saat ini: $(node -v)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js version: $(node -v)" -ForegroundColor Green
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: Gagal install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Check environment variables
if (-not $env:NEXT_PUBLIC_API_BASE_URL) {
    Write-Host "⚠️  Warning: NEXT_PUBLIC_API_BASE_URL tidak di-set" -ForegroundColor Yellow
    Write-Host "   Pastikan untuk set environment variable di Netlify" -ForegroundColor Yellow
    Write-Host ""
}

# Build
Write-Host "🔨 Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Build gagal!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build berhasil!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Deploy ke Netlify (via CLI atau Dashboard)"
Write-Host "   2. Set environment variable: NEXT_PUBLIC_API_BASE_URL"
Write-Host "   3. Pastikan backend Django sudah di-deploy"
Write-Host "   4. Update CORS di backend dengan domain Netlify"
Write-Host ""
Write-Host "💡 Untuk deploy via Netlify CLI:" -ForegroundColor Cyan
Write-Host "   netlify deploy --prod"
Write-Host ""

