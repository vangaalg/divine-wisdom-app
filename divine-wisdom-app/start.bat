@echo off
echo Starting Divine Wisdom Application...

rem Navigate to the server directory
cd server

echo Starting server...
start "Divine Wisdom Server" cmd /c "npm install && node server.js"

rem Wait for the server to start
timeout /t 5

rem Navigate to the client directory
cd ..\client

echo Starting client...
start "Divine Wisdom Client" cmd /c "npm install && npm start"

echo.
echo Both client and server are now running!
echo The client should open automatically in your default browser.
echo.
echo If the client doesn't start, you can manually open http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the server and client when done.