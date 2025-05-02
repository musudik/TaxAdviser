#!/bin/bash
echo "Starting Tax Adviser Development Environment..."

# Terminal 1: Backend
echo "Starting backend (Express server)..."
gnome-terminal --title="Backend Server" -- bash -c "cd backend && pnpm run start:express; exec bash" 2>/dev/null || \
xterm -T "Backend Server" -e "cd backend && pnpm run start:express; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$PWD'/backend && pnpm run start:express"' 2>/dev/null || \
echo "Could not open a new terminal window. Please start the backend manually: cd backend && pnpm run start:express"

# Terminal 2: Frontend
echo "Starting frontend (Vite development server)..."
gnome-terminal --title="Frontend Server" -- bash -c "cd frontend && pnpm run dev; exec bash" 2>/dev/null || \
xterm -T "Frontend Server" -e "cd frontend && pnpm run dev; exec bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$PWD'/frontend && pnpm run dev"' 2>/dev/null || \
echo "Could not open a new terminal window. Please start the frontend manually: cd frontend && pnpm run dev"

echo "Development servers should be starting..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173" 