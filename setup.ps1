# EWallet Playwright Setup Script
Write-Host "🚀 Setting up EWallet Playwright Tests..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install Playwright browsers
Write-Host "🌐 Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "🔧 Creating .env file..." -ForegroundColor Yellow
    Copy-Item "config.env.example" ".env"
    Write-Host "✅ .env file created from config.env.example" -ForegroundColor Green
    Write-Host "⚠️  Please update .env with your actual credentials!" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your credentials" -ForegroundColor White
Write-Host "2. Run tests: npm test" -ForegroundColor White
Write-Host "3. Run with UI: npm run test:ui" -ForegroundColor White
Write-Host ""
Write-Host "Happy testing! 🧪" -ForegroundColor Green
