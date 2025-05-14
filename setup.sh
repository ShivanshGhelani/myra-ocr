#!/bin/bash

# Text Scanner OCR Application Setup Script
# This script sets up the environment and dependencies for the Text Scanner OCR application

echo "🔍 Setting up Text Scanner OCR Application..."

# Check if Python 3.9+ is installed
if command -v python3 &>/dev/null; then
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    echo "✅ Found Python $PYTHON_VERSION"
    
    # Check version
    if [[ $(python3 -c 'import sys; print(sys.version_info >= (3, 9))') == "False" ]]; then
        echo "❌ Python 3.9 or higher is required"
        exit 1
    fi
else
    echo "❌ Python 3 not found. Please install Python 3.9 or higher."
    exit 1
fi

# Create virtual environment
echo "🔧 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Windows alternative
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🔧 Detected Windows environment"
    python3 -m venv venv
    source venv/Scripts/activate
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Installation complete!"
echo "👉 To start the application, run:"
echo "   source venv/bin/activate  # If not already activated"
echo "   uvicorn api.main:app --reload"
echo "👉 Then open your browser at: http://localhost:8000"

# Done
echo "🚀 Happy OCR-ing!"
