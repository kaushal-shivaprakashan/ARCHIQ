.PHONY: dev test lint format build seed-rag

# ── Development ──────────────────────────────────────────────
dev:
	docker-compose up --build

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

# ── Testing ──────────────────────────────────────────────────
test:
	cd backend && pytest tests/ -v

test-watch:
	cd backend && pytest tests/ -v --watch

# ── Code Quality ─────────────────────────────────────────────
lint:
	cd backend && ruff check app/ tests/
	cd frontend && npm run lint

format:
	cd backend && black app/ tests/
	cd frontend && npx prettier --write src/

# ── Database ─────────────────────────────────────────────────
seed-rag:
	cd backend && python scripts/seed_vector_db.py

# ── Build ────────────────────────────────────────────────────
build:
	cd frontend && npm run build
	docker build -t archiq-backend ./backend

# ── Deployment ───────────────────────────────────────────────
deploy-fe:
	cd frontend && npx vercel deploy --prod

deploy-be:
	railway up

# ── Utilities ────────────────────────────────────────────────
install:
	cd backend && pip install -r requirements.txt -r requirements-dev.txt
	cd frontend && npm install

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -name "*.pyc" -delete
	cd frontend && rm -rf dist node_modules/.vite
