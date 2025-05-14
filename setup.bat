@echo off
:: Text Scanner OCR Application Setup Script for Windows
:: This script sets up the environment and dependencies for the Text Scanner OCR application

echo 🔍 Setting up Text Scanner OCR Application...

:: Check if Python is installed
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.9 or higher.
    exit /b 1
)

:: Check Python version
for /f "tokens=2" %%i in ('python --version') do set PYTHONVER=%%i
echo ✅ Found Python %PYTHONVER%

:: Create virtual environment
echo 🔧 Creating virtual environment...
python -m venv venv

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Install dependencies
echo 📦 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo ✅ Installation complete!
echo 👉 To start the application, run:
echo    venv\Scripts\activate.bat
echo    uvicorn api.main:app --reload
echo 👉 Then open your browser at: http://localhost:8000

:: Done
echo 🚀 Happy OCR-ing!
