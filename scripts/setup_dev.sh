#!/bin/bash
# ArchIQ — One-command dev setup

set -e
echo "⚡ Setting up ArchIQ development environment..."

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "Python 3.11+ required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js 18+ required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }

# Copy env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from template"
  echo "⚠  Add your ANTHROPIC_API_KEY to .env before running"
fi

# Backend
echo "📦 Installing backend dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
cd ..

# Frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your ANTHROPIC_API_KEY to .env"
echo "  2. Run: make dev"
echo "  3. Open: http://localhost:3000"
