# Скрипт для запуска всего проекта Task Manager

Write-Host "🚀 Запуск Task Manager проекта..." -ForegroundColor Cyan
Write-Host ""

# Проверка Docker
Write-Host "📦 Проверка Docker Desktop..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop не запущен!" -ForegroundColor Red
    Write-Host "⚠️  Пожалуйста, запустите Docker Desktop и повторите попытку." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
Write-Host "✅ Docker Desktop запущен" -ForegroundColor Green
Write-Host ""

# Запуск базы данных
Write-Host "🐘 Запуск PostgreSQL базы данных..." -ForegroundColor Yellow
Set-Location "task-manager-api"
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при запуске базы данных!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ База данных запущена" -ForegroundColor Green
Write-Host "⏳ Ожидание запуска базы данных (10 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host ""

# Запуск Backend
Write-Host "🔧 Запуск Backend (NestJS)..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей Backend..." -ForegroundColor Yellow
    npm install
}
Write-Host "🚀 Запуск Backend на http://localhost:3001..." -ForegroundColor Cyan
Write-Host "📚 Swagger документация: http://localhost:3001/api/docs" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev"
Write-Host ""

# Запуск Frontend
Write-Host "🎨 Запуск Frontend (Nuxt 3)..." -ForegroundColor Yellow
Set-Location "..\task-manager-frontend"
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей Frontend..." -ForegroundColor Yellow
    npm install
}
Write-Host "🚀 Запуск Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Write-Host ""

Set-Location ".."
Write-Host "✅ Все сервисы запущены!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Ссылки:" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   API Docs: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Для остановки сервисов используйте Ctrl+C в соответствующих окнах" -ForegroundColor Yellow
Write-Host "💡 Для остановки базы данных выполните: cd task-manager-api && docker-compose down" -ForegroundColor Yellow
