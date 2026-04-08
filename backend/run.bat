@echo off
REM Setup and Run College Advisor RAG Backend (Windows)
REM Run this batch file to set up and start the server

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   College Advisor RAG - Backend Setup ^& Launch         ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Step 1: Check Python
echo ✓ Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python not found. Please install Python 3.8+
    exit /b 1
)
python --version
echo.

REM Step 2: Create Virtual Environment
echo ✓ Setting up Python environment...
if not exist "venv" (
    echo   Creating new virtual environment...
    python -m venv venv
) else (
    echo   Using existing virtual environment...
)
echo.

REM Step 3: Activate Virtual Environment
echo ✓ Activating virtual environment...
call venv\Scripts\activate.bat
echo   Virtual environment activated
echo.

REM Step 4: Install Dependencies
echo ✓ Installing dependencies...
echo   This may take several minutes on first run...
python -m pip install --upgrade pip setuptools wheel -q
pip install -r requirements.txt -q
echo   Dependencies installed
echo.

REM Step 5: Verify Setup
echo ✓ Verifying setup...
python test_setup.py
echo.

REM Step 6: Start Server
echo ✓ Starting College Advisor RAG API...
echo   Server will run at http://localhost:8000
echo   API Docs at http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py

pause
