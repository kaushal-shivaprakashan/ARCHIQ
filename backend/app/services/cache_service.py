"""
ArchIQ — Redis Cache Service
"""

import json
from typing import Optional


class CacheService:
    def __init__(self, redis_client):
        self.redis = redis_client

    async def get(self, key: str) -> Optional[dict]:
        try:
            val = await self.redis.get(f"archiq:{key}")
            return json.loads(val) if val else None
        except Exception:
            return None

    async def set(self, key: str, value: dict, ttl: int = 3600):
        try:
            await self.redis.setex(
                f"archiq:{key}", ttl, json.dumps(value)
            )
        except Exception:
            pass  # Cache failures are non-fatal

    async def delete(self, key: str):
        try:
            await self.redis.delete(f"archiq:{key}")
        except Exception:
            pass
