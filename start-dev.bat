@echo off
echo Starting Tax Adviser Development Environment...

echo Starting backend (Express server)...
start cmd /k "cd backend && pnpm run start:express"

echo Starting frontend (Vite development server)...
start cmd /k "cd frontend && pnpm run dev"

echo Development servers started!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173 