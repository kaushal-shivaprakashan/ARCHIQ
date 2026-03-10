"""
ArchIQ — API Routes
"""

import hashlib
import json
import uuid
from fastapi import APIRouter, HTTPException, Depends
from app.models.inputs import ArchitectureRequest, RefineRequest
from app.models.outputs import ArchitectureResponse
from app.services.architecture_engine import ArchitectureEngine
from app.services.llm_service import LLMService
from app.services.cache_service import CacheService
from app.core.database import get_db, get_redis
from app.core.config import settings

router = APIRouter()
engine = ArchitectureEngine()


def _input_fingerprint(inputs: ArchitectureRequest) -> str:
    """Create a cache key hash from input parameters."""
    data = inputs.model_dump()
    canonical = json.dumps(data, sort_keys=True)
    return hashlib.sha256(canonical.encode()).hexdigest()[:16]


@router.post("/generate", response_model=ArchitectureResponse)
async def generate_architecture(
    request: ArchitectureRequest,
    db=Depends(get_db),
    redis=Depends(get_redis),
):
    """
    Generate a full data architecture from user inputs.

    Flow:
    1. Check Redis cache for identical input fingerprint
    2. If cache miss: run rule engine (fast, deterministic)
    3. If LLM enabled: enhance with Claude for nuanced reasoning
    4. Store result in PostgreSQL
    5. Cache result in Redis
    6. Return to client
    """
    fingerprint = _input_fingerprint(request)
    cache_svc = CacheService(redis)

    # 1. Check cache
    if settings.ENABLE_CACHE:
        cached = await cache_svc.get(fingerprint)
        if cached:
            return ArchitectureResponse(**cached)

    # 2. Rule engine (always runs — fast baseline)
    arch = engine.build(request)

    # 3. LLM enhancement (optional — adds nuance for edge cases)
    if settings.ENABLE_RAG:
        try:
            llm_svc = LLMService()
            arch = await llm_svc.enhance(request, arch)
            arch.generated_by = "hybrid"
        except Exception as e:
            # Graceful degradation — rule engine output is still valid
            print(f"LLM enhancement failed, using rule engine: {e}")

    # 4. Assign session ID and persist
    arch.session_id = str(uuid.uuid4())[:8]
    async with db.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO architectures (session_id, inputs, output)
            VALUES ($1, $2, $3)
            ON CONFLICT (session_id) DO UPDATE SET output = $3, updated_at = NOW()
            """,
            arch.session_id,
            json.dumps(request.model_dump()),
            json.dumps(arch.model_dump()),
        )

    # 5. Cache result
    if settings.ENABLE_CACHE:
        await cache_svc.set(fingerprint, arch.model_dump(), ttl=settings.CACHE_TTL_SECONDS)

    return arch


@router.get("/architecture/{session_id}", response_model=ArchitectureResponse)
async def get_architecture(session_id: str, db=Depends(get_db)):
    """Retrieve a previously generated architecture by session ID."""
    async with db.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT output FROM architectures WHERE session_id = $1",
            session_id,
        )
    if not row:
        raise HTTPException(status_code=404, detail=f"Architecture '{session_id}' not found")
    return ArchitectureResponse(**json.loads(row["output"]))


@router.post("/refine", response_model=ArchitectureResponse)
async def refine_architecture(request: RefineRequest, db=Depends(get_db)):
    """
    Refine an existing architecture with a follow-up instruction.
    Example: 'What if we migrate to GCP in 18 months?'
    """
    # Fetch original architecture
    async with db.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT inputs, output FROM architectures WHERE session_id = $1",
            request.session_id,
        )
    if not row:
        raise HTTPException(status_code=404, detail="Architecture not found")

    original_inputs = json.loads(row["inputs"])
    original_arch = ArchitectureResponse(**json.loads(row["output"]))

    # Send to LLM with refinement context
    llm_svc = LLMService()
    refined = await llm_svc.refine(original_inputs, original_arch, request.instruction)
    refined.session_id = request.session_id + "_refined"

    return refined


@router.get("/cost/{session_id}")
async def get_cost_breakdown(session_id: str, db=Depends(get_db)):
    """Get detailed cost breakdown and optimization suggestions."""
    async with db.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT output FROM architectures WHERE session_id = $1",
            session_id,
        )
    if not row:
        raise HTTPException(status_code=404, detail="Architecture not found")

    arch = ArchitectureResponse(**json.loads(row["output"]))
    return {
        "session_id": session_id,
        "cost_items": arch.cost_items,
        "total_base": sum(i.base_monthly for i in arch.cost_items),
        "total_optimized": sum(
            i.base_monthly - (i.optimize_saving or 0) for i in arch.cost_items
        ),
        "total_savings": sum(i.optimize_saving or 0 for i in arch.cost_items),
    }
