#!/usr/bin/env bash
# Quick Start Script for macOS & Linux teammates
set -e

echo "🚀 Building and starting ShopBack TaskFlow in Docker container..."
docker compose up --build -d

echo ""
echo "===================================================="
echo "✅ ShopBack TaskFlow is running successfully!"
echo "🌐 Open in browser: http://localhost:8080"
echo "📜 View logs:      docker compose logs -f"
echo "🛑 Stop container:  docker compose down"
echo "===================================================="
