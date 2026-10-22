#!/bin/bash
# One-click startup script for Sentrix
echo "=========================================================="
echo "🛡️  STARTING SENTRIX EMERGENCY RESPONSE PLATFORM"
echo "=========================================================="

# Free any existing processes on port 5001 or 5173
lsof -ti:5001 -ti:5173 | xargs kill -9 2>/dev/null || true

# Start concurrently
npm run dev
