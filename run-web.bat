@echo off
chcp 65001 >nul
title TechStore System - Frontend & SQL Server Backend
echo ===================================================================
echo   TechStore VIP PRO - Hệ Thống Bán Hàng & Quản Trị Hệ Thống
echo   Database: SQL Server (TechStoreDB @ SQLEXPRESS2025)
echo ===================================================================

echo [1/3] Đang khởi động Backend API (Node.js Express + SQL Server)...
start "TechStore Backend API (Port 5000)" cmd /k "cd /d "%~dp0server" && node server.js"

echo [2/3] Đang mở trình duyệt kết nối website...
timeout /t 2 /nobreak >nul
start http://localhost:5500

echo [3/3] Đang chạy Frontend Web Server tại: http://localhost:5500
echo Nhấn Ctrl + C để dừng Frontend.
echo ===================================================================
echo.
python -m http.server 5500
pause
