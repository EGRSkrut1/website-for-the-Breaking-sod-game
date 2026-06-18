@echo off
title Breaking Sod Website
echo.
echo Installing dependencies...
call npm install > nul 2>&1
echo.
echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.
call npm start