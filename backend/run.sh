#!/bin/bash
# Setup and Run College Advisor RAG Backend
# Run this script to set up and start the server

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════╗"
echo "║   College Advisor RAG - Backend Setup & Launch         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check Python
echo "✓ Checking Python..."
if ! command -v python &> /dev/null; then
    echo "✗ Python not found. Please install Python 3.8+"
    exit 1
fi
PYTHON_VERSION=$(python --version 2>&1)
echo "  Found: $PYTHON_VERSION"
echo ""

# Step 2: Create Virtual Environment
echo "✓ Setting up Python environment..."
if [ ! -d "venv" ]; then
    echo "  Creating new virtual environment..."
    python -m venv venv
else
    echo "  Using existing virtual environment..."
fi
echo ""

# Step 3: Activate Virtual Environment
echo "✓ Activating virtual environment..."
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
echo "  Virtual environment activated"
echo ""

# Step 4: Install Dependencies
echo "✓ Installing dependencies..."
echo "  This may take several minutes on first run..."
pip install --upgrade pip setuptools wheel --quiet
pip install -r requirements.txt --quiet
echo "  Dependencies installed"
echo ""

# Step 5: Verify Setup
echo "✓ Verifying setup..."
python test_setup.py
echo ""

# Step 6: Start Server
echo "✓ Starting College Advisor RAG API..."
echo "  Server will run at http://localhost:8000"
echo "  API Docs at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py
