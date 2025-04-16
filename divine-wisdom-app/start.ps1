Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Starting Divine Wisdom Application" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Starting the backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$pwd\server'; npm run dev"

Write-Host ""
Write-Host "Starting the frontend client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$pwd\client'; npm start"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Divine Wisdom is starting up!" -ForegroundColor Green
Write-Host "    - The client will be available at: http://localhost:3000" -ForegroundColor White
Write-Host "    - The server API is at: http://localhost:5000" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Cyan 