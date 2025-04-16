# Krishna's Divine Wisdom - WiFi Network Hosting

Write-Host "Krishna's Divine Wisdom - WiFi Network Hosting" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Display IP information for user
Write-Host "Your network interfaces:" -ForegroundColor Yellow
$networkInterfaces = Get-NetIPAddress | Where-Object { $_.AddressFamily -eq "IPv4" -and !$_.IPAddress.StartsWith("127.") }
$networkInterfaces | Format-Table InterfaceAlias, IPAddress -AutoSize

Write-Host ""
Write-Host "Use one of the IP addresses above when connecting from other devices" -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
if (Test-Path "server") {
    Set-Location -Path "server"
} else {
    Write-Host "Error: Server directory not found." -ForegroundColor Red
    exit 1
}

# Start server
Write-Host "Starting server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\server'; npm install; `$env:HOST='0.0.0.0'; node server.js" -PassThru

# Wait for the server to initialize
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Navigate to client directory
Set-Location -Path "$PSScriptRoot\client"

# Start client with network settings
Write-Host "Starting client..." -ForegroundColor Yellow
$clientProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd '$PSScriptRoot\client'; npm install; `$env:HOST='0.0.0.0'; `$env:DANGEROUSLY_DISABLE_HOST_CHECK='true'; npm start" -PassThru

Write-Host ""
Write-Host "Both server and client have been started!" -ForegroundColor Green
Write-Host ""
Write-Host "For other devices on your WiFi network:" -ForegroundColor Cyan
Write-Host "1. Make sure all devices are connected to the same WiFi network" -ForegroundColor Cyan
Write-Host "2. On other devices, open a web browser and enter the URL shown in the server window" -ForegroundColor Cyan
Write-Host "   (Look for the 'Network:' URL in the server window)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the server and client when done." -ForegroundColor Yellow 