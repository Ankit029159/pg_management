#!/bin/bash

echo "Starting PhonePe Payment Gateway Test Environment..."
echo

echo "Starting Backend Server..."
cd backend
gnome-terminal --title="Backend Server" -- bash -c "npm start; exec bash" &
echo "Backend starting on https://api.pg.gradezy.in"
echo

echo "Waiting 5 seconds for backend to start..."
sleep 5

echo "Starting Frontend..."
cd ../frontend
gnome-terminal --title="Frontend" -- bash -c "npm run dev; exec bash" &
echo "Frontend starting on http://localhost:5173"
echo

echo "Test Environment Starting..."
echo
echo "Backend: https://api.pg.gradezy.in"
echo "Frontend: http://localhost:5173"
echo
echo "Test PhonePe Config: https://api.pg.gradezy.in/api/payment/test-config"
echo "Booking Page: http://localhost:5173/bookingpg"
echo

# Try to open browser (works on most Linux systems)
if command -v xdg-open &> /dev/null; then
    echo "Opening test pages in browser..."
    xdg-open "https://api.pg.gradezy.in/api/payment/test-config" &
    sleep 2
    xdg-open "http://localhost:5173/bookingpg" &
elif command -v open &> /dev/null; then
    echo "Opening test pages in browser..."
    open "https://api.pg.gradezy.in/api/payment/test-config"
    sleep 2
    open "http://localhost:5173/bookingpg"
fi

echo
echo "Test environment is ready!"
echo "Check the opened browser tabs to test the integration."
echo
echo "Press Ctrl+C to stop all services"
echo

# Wait for user to stop
trap 'echo "Stopping services..."; pkill -f "npm start"; pkill -f "npm run dev"; exit' INT
wait
