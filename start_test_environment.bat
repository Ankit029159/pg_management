@echo off
echo Starting PhonePe Payment Gateway Test Environment...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"
echo Backend starting on https://api.pg.gradezy.in
echo.

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"
echo Frontend starting on http://localhost:5173
echo.

echo Test Environment Starting...
echo.
echo Backend: https://api.pg.gradezy.in
echo Frontend: http://localhost:5173
echo.
echo Test PhonePe Config: https://api.pg.gradezy.in/api/payment/test-config
echo Booking Page: http://localhost:5173/bookingpg
echo.
echo Press any key to open the test pages...
pause >nul

start https://api.pg.gradezy.in/api/payment/test-config
start http://localhost:5173/bookingpg

echo.
echo Test environment is ready!
echo Check the opened browser tabs to test the integration.
echo.
pause
