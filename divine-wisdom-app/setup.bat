@echo off
echo ====================================================
echo    Setting up Divine Wisdom Application
echo ====================================================

echo.
echo Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% neq 0 (
  echo Error installing client dependencies!
  exit /b %ERRORLEVEL%
)

echo.
echo Installing server dependencies...
cd ..\server
call npm install
if %ERRORLEVEL% neq 0 (
  echo Error installing server dependencies!
  exit /b %ERRORLEVEL%
)

echo.
echo Creating .env file from template...
copy .env.example .env
echo Please edit the .env file to add your OpenAI API key before starting the application.
echo.

echo ====================================================
echo    Setup complete!
echo ====================================================
echo.
echo To start the application:
echo 1. First, start the server: 
echo    cd server
echo    npm run dev
echo.
echo 2. In a new terminal, start the client:
echo    cd client
echo    npm start
echo.
echo Thank you for using Divine Wisdom!
echo ==================================================== 