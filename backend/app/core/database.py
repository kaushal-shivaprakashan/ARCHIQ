"""
ArchIQ — Database Connections
PostgreSQL (via asyncpg) + Redis (via aioredis)
"""

import asyncpg
import aioredis
from app.core.config import settings

# Global connection pools
_pg_pool = None
_redis_client = None


async def init_db():
    global _pg_pool, _redis_client
    _pg_pool = await asyncpg.create_pool(
        settings.DATABASE_URL,
        min_size=2,
        max_size=10,
    )
    _redis_client = await aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )
    await _run_migrations()


async def close_db():
    global _pg_pool, _redis_client
    if _pg_pool:
        await _pg_pool.close()
    if _redis_client:
        await _redis_client.close()


async def get_db():
    return _pg_pool


async def get_redis():
    return _redis_client


async def _run_migrations():
    """Run schema migrations on startup."""
    async with _pg_pool.acquire() as conn:
        await conn.execute("""
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS "vector";

            CREATE TABLE IF NOT EXISTS architectures (
                id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                session_id  TEXT UNIQUE NOT NULL,
                inputs      JSONB NOT NULL,
                output      JSONB NOT NULL,
                created_at  TIMESTAMPTZ DEFAULT NOW(),
                updated_at  TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS architecture_docs (
                id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                content     TEXT NOT NULL,
                metadata    JSONB,
                embedding   vector(1536),
                created_at  TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_arch_docs_embedding
                ON architecture_docs USING ivfflat (embedding vector_cosine_ops);
        """)
