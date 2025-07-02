#!/bin/bash

# Kill any existing processes
pkill -f "tsx server/simpleServer.ts" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Wait for processes to stop
sleep 2

# Start backend server
echo "Starting backend server..."
tsx server/simpleServer.ts &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

# Wait for both to be ready
sleep 5

echo "Both servers are starting up..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Keep script running
wait