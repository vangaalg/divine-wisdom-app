Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Setting up Divine Wisdom Application" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path .\client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing client dependencies!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location -Path ..\server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing server dependencies!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Creating .env file from template..." -ForegroundColor Yellow
Copy-Item -Path .env.example -Destination .env
Write-Host "Please edit the .env file to add your OpenAI API key before starting the application." -ForegroundColor Magenta
Write-Host ""

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Setup complete!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host "1. First, start the server: " -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In a new terminal, start the client:" -ForegroundColor White
Write-Host "   cd client" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "Thank you for using Divine Wisdom!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan 