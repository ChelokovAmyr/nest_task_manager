# Скрипт для остановки проекта Task Manager

Write-Host "🛑 Остановка Task Manager проекта..." -ForegroundColor Cyan
Write-Host ""

# Остановка базы данных
Write-Host "🐘 Остановка PostgreSQL базы данных..." -ForegroundColor Yellow
Set-Location "task-manager-api"
docker-compose down
Write-Host "✅ База данных остановлена" -ForegroundColor Green
Write-Host ""

Set-Location ".."
Write-Host "✅ Проект остановлен!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Примечание: Окна Backend и Frontend нужно закрыть вручную" -ForegroundColor Yellow
