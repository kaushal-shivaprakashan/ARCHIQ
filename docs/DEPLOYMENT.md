# ArchIQ — Deployment Guide

## Frontend → Vercel

```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.railway.app
```

## Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Initialize project
cd backend
railway init

# Add environment variables
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set DATABASE_URL=postgresql://...
railway variables set REDIS_URL=redis://...

# Deploy
railway up
```

Railway auto-provisions PostgreSQL and Redis as add-ons.

## Database Setup

Railway PostgreSQL needs pgvector extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Run migrations by starting the backend — `init_db()` runs on startup.

## Seed the RAG Vector Store

```bash
# After deployment, run the seed script
railway run python scripts/seed_vector_db.py
```

## Production Checklist

- [ ] `ANTHROPIC_API_KEY` set in Railway
- [ ] `DATABASE_URL` points to Railway PostgreSQL
- [ ] `REDIS_URL` points to Railway Redis
- [ ] `APP_ENV=production` set
- [ ] `DEBUG=false` set
- [ ] `ALLOWED_ORIGINS` includes your Vercel domain
- [ ] pgvector extension enabled on PostgreSQL
- [ ] RAG vector store seeded
- [ ] Frontend `VITE_API_URL` points to Railway backend
