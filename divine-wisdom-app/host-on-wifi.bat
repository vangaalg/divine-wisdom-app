@echo off
echo Krishna's Divine Wisdom - WiFi Network Hosting
echo ==============================================
echo This script will start the application so it's accessible on your local WiFi network
echo.

REM Display IP information for user
ipconfig | findstr /R /C:"IPv4 Address"
echo.
echo ^^ Your IP address is listed above. Other devices can connect using this address.
echo.

REM Navigate to the server directory
cd server

echo Starting server...
start "Divine Wisdom Server" cmd /c "npm install && node server.js"

REM Wait for the server to start
timeout /t 5

REM Navigate to the client directory
cd ..\client

echo Starting client...
start "Divine Wisdom Client" cmd /c "npm install && set HOST=0.0.0.0 && set DANGEROUSLY_DISABLE_HOST_CHECK=true && npm start"

echo.
echo Both client and server are now running!
echo The client should open automatically in your browser.
echo.
echo For other devices on your WiFi network:
echo 1. Make sure all devices are connected to the same WiFi network
echo 2. On other devices, open a web browser and enter the URL shown in the server window
echo    (Look for the "Network:" URL in the server window)
echo.
echo Press Ctrl+C in each window to stop the server and client when done.
echo. 