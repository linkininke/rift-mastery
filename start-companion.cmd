@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "NODE_EXE="
for /f "delims=" %%N in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%N"
if not defined NODE_EXE (echo 未找到 Node.js，请先安装 Node.js 20 或更高版本。 & pause & exit /b 1)
echo 正在启动峡谷进阶同步助手，请在 Windows 权限提示中选择“是”…
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%NODE_EXE%' -ArgumentList @('%~dp0scripts\lcu-companion.mjs') -WorkingDirectory '%~dp0' -Verb RunAs -WindowStyle Hidden"
timeout /t 2 >nul
echo 同步助手已在后台启动。现在可以回到网页点击“一键同步”。
pause
