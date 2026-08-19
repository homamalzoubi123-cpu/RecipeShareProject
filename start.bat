@echo off
start cmd /k "cd frontend && npm run dev -- --host"
start cmd /k "cd backend && dotnet run"