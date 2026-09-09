#!/usr/bin/env bash
# ==============================================================================
# Pathway — Latent Reasoning Laboratory Unified Launcher
# Launches Python FastAPI Computational Backend (port 8000)
# and React + Vite + TypeScript Frontend (port 5173)
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "===================================================================="
echo "🧪 PATHWAY — LATENT REASONING LABORATORY"
echo "===================================================================="

# 1. Start Python FastAPI Computational Backend
echo "Starting Python FastAPI backend on http://127.0.0.1:8000..."
python3 -m uvicorn api.server:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Trap signals for clean exit
cleanup() {
    echo ""
    echo "Stopping laboratory services..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Wait a moment for backend to initialize
sleep 2

# Check if backend is alive
if curl -s http://127.0.0.1:8000/api/health > /dev/null; then
    echo "✓ Python FastAPI backend online."
else
    echo "⚠️ Warning: Backend health check did not respond immediately, continuing..."
fi

# 2. Start React + Vite Frontend
echo "Starting React + Vite frontend on http://localhost:5173..."
cd "$DIR/frontend"

# Fallback in case node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "===================================================================="
echo "🚀 LABORATORY READY"
echo "   • React Frontend: http://localhost:5173"
echo "   • FastAPI API:    http://127.0.0.1:8000"
echo "   • API Docs:       http://127.0.0.1:8000/docs"
echo "   • Fallback UI:    streamlit run main.py"
echo "===================================================================="
echo ""

npm run dev -- --host
