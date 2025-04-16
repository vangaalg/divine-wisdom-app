# Divine Wisdom Application Startup Script

Write-Host "Starting Divine Wisdom Application..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Navigate to server directory and start server
Write-Host "Starting server..." -ForegroundColor Yellow
$serverProcessInfo = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\server'; npm install; node server.js" -PassThru

# Wait a moment for the server to initialize
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Navigate to client directory and start client
Write-Host "Starting client..." -ForegroundColor Yellow
$clientProcessInfo = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\client'; npm install; npm start" -PassThru

Write-Host ""
Write-Host "Both server and client have been started!" -ForegroundColor Green
Write-Host "Server running at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Client running at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the server and client when done." -ForegroundColor Yellow
Write-Host "Or you can close the terminal windows directly." -ForegroundColor Yellow 