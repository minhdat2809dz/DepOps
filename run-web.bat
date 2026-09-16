@echo off
chcp 65001 >nul
title TechStore Web Server
echo ===================================================
echo   TechStore - Cửa Hàng & Quản Trị Hệ Thống
echo   Đang chạy tại: http://localhost:5500
echo ===================================================
echo Đang mở trình duyệt...
start http://localhost:5500
echo Nhấn Ctrl + C để dừng máy chủ web.
echo.
python -m http.server 5500
pause
