@echo off
echo Starting Tax Adviser development environment...

REM Start the Express backend server
start cmd /k "cd backend && npm run start:express"

REM Wait a moment to ensure backend starts first
timeout /t 3 /nobreak

REM Start the frontend Vite server
start cmd /k "cd frontend && npm run dev"

echo.
echo Development servers started!
echo Backend: http://localhost:3001/api
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each terminal window to stop the servers 