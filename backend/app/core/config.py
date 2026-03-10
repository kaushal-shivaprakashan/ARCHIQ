"""
ArchIQ — Application Configuration
All settings loaded from environment variables with validation.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # === LLM ===
    ANTHROPIC_API_KEY: str
    LLM_MODEL: str = "claude-sonnet-4-6"
    LLM_MAX_TOKENS: int = 4096
    LLM_TEMPERATURE: float = 0.2

    # === DATABASE ===
    DATABASE_URL: str = "postgresql://archiq:password@localhost:5432/archiq"
    REDIS_URL: str = "redis://localhost:6379"

    # === CACHING ===
    CACHE_TTL_SECONDS: int = 3600
    ENABLE_CACHE: bool = True

    # === RAG ===
    ENABLE_RAG: bool = True
    RAG_TOP_K: int = 5
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # === CORS ===
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://archiq.vercel.app",
    ]

    # === APP ===
    APP_ENV: str = "development"
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
