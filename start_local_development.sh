#!/bin/bash

echo "🚀 Starting PG Management System in Local Development Mode..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"
echo

# Start Backend Server
echo "🔧 Starting Backend Server..."
echo "📍 Backend will run on: http://localhost:5001"
echo "📍 API Base URL: http://localhost:5001/api"
echo

cd backend
cp config.local.env config.env
echo "✅ Local environment loaded for backend"

# Start backend in background
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend Server
echo "🔧 Starting Frontend Server..."
echo "📍 Frontend will run on: http://localhost:5173"
echo "📍 API will connect to: http://localhost:5001/api"
echo

cd ../frontend
cp env.local .env.local
echo "✅ Local environment loaded for frontend"

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo
echo "✅ Both servers are starting..."
echo
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5001/api"
echo "   Backend Health: http://localhost:5001/api/test"
echo
echo "📝 Development Notes:"
echo "   - Backend uses local environment (config.local.env)"
echo "   - Frontend uses local environment (env.local)"
echo "   - PhonePe is in TEST MODE (bypasses real payments)"
echo "   - CORS is configured for localhost"
echo
echo "🛑 To stop servers: Press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait

