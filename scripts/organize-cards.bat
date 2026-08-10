@echo off
chcp 65001 >nul
cd /d "%~dp0.."
title Holodream 角色名片整理

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo [錯誤] 找不到 Node.js
  echo 請在 Cursor 終端機執行：npm run organize-cards
  echo.
  pause
  exit /b 1
)

echo 正在整理 角色名片\_待整理 ...
echo.
node scripts/organizeCharacterCardInbox.mjs
set ERR=%ERRORLEVEL%
echo.
if %ERR% neq 0 (
  echo 整理失敗，請看上方訊息。
) else (
  echo 完成。
)
echo.
pause
exit /b %ERR%
