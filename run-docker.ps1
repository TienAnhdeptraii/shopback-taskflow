# Quick Start Script for Windows PowerShell
Write-Host "🚀 Building and starting ShopBack TaskFlow in Docker container..." -ForegroundColor Cyan
docker compose up --build -d

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "✅ ShopBack TaskFlow is running successfully!" -ForegroundColor Green
Write-Host "🌐 Open in browser: http://localhost:8080" -ForegroundColor Yellow
Write-Host "📜 View logs:      docker compose logs -f" -ForegroundColor Gray
Write-Host "🛑 Stop container:  docker compose down" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Green
