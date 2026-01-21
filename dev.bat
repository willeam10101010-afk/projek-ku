@echo off
REM Local Development Helper Script for Windows
REM This script helps run the DApp locally for development

echo ========================================
echo Crypto Mining DApp - Development Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js v16 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [OK] npm found
npm --version
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env
    echo [OK] .env file created
    echo [WARNING] Please edit .env and add your configuration
) else (
    echo [OK] .env file found
)

echo.
echo What would you like to do?
echo 1) Compile contracts
echo 2) Run tests
echo 3) Start frontend (port 8080)
echo 4) Start backend (port 3000)
echo 5) Deploy to testnet
echo 6) Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto compile
if "%choice%"=="2" goto test
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto backend
if "%choice%"=="5" goto deploy
if "%choice%"=="6" goto end
goto invalid

:compile
echo.
echo Compiling smart contracts...
call npm run compile
goto end

:test
echo.
echo Running tests...
call npm test
goto end

:frontend
echo.
echo Starting frontend on http://localhost:8080
echo Press Ctrl+C to stop
cd frontend
python -m http.server 8080
goto end

:backend
echo.
echo Starting backend on http://localhost:3000
echo Press Ctrl+C to stop
node backend/server.js
goto end

:deploy
echo.
echo Deploying to testnet...
call npm run compile
if %errorlevel% equ 0 (
    call npm run deploy:testnet
    echo.
    echo [WARNING] Remember to update contract addresses in:
    echo   - .env
    echo   - frontend/app.js
)
goto end

:invalid
echo [ERROR] Invalid choice
goto end

:end
echo.
echo Done!
pause
