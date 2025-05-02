#!/bin/bash

echo "Starting Tax Adviser development environment..."

# Start the Express backend server
cd backend && npm run start:express &
BACKEND_PID=$!

# Wait a moment to ensure backend starts first
sleep 3

# Start the frontend Vite server
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Development servers started!"
echo "Backend: http://localhost:3001/api"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the servers"

# Set up trap to kill both processes when script is terminated
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT

# Keep script running
wait 