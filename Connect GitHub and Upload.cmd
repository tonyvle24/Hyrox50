@echo off
setlocal
title HYROX50 GitHub Upload

set "ROOT=%~dp0"
set "GH=%ROOT%.tools\gh-cli-v2.93.0\bin\gh.exe"
set "GIT=%ROOT%.tools\PortableGit\cmd\git.exe"
set "GH_CONFIG_DIR=%ROOT%.tools\gh-config"

echo.
echo HYROX50 GitHub Upload
echo =====================
echo.

if not exist "%GH%" (
  echo GitHub's official sign-in tool is missing.
  echo Ask Codex to restore it, then run this file again.
  pause
  exit /b 1
)

echo Step 1 of 2: Securely connect this computer to GitHub.
echo A browser page and one-time code will be shown if sign-in is needed.
echo.
"%GH%" auth status --hostname github.com >nul 2>&1
if errorlevel 1 (
  "%GH%" auth login --hostname github.com --git-protocol https --web
  if errorlevel 1 (
    echo.
    echo GitHub sign-in did not finish. Nothing was uploaded.
    pause
    exit /b 1
  )
)

echo.
echo Step 2 of 2: Uploading HYROX50 to GitHub.
"%GH%" auth setup-git
"%GIT%" -C "%ROOT%" -c "safe.directory=%ROOT%" push -u origin main
if errorlevel 1 (
  echo.
  echo Upload failed. Nothing on your computer was deleted.
  pause
  exit /b 1
)

echo.
echo Success. HYROX50 was uploaded to GitHub.
echo GitHub will now build the hosted website.
echo.
pause
