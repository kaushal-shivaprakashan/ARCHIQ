# ArchIQ — System Architecture

## Overview

ArchIQ is a hybrid AI system that combines a **deterministic rule engine** with **LLM enhancement** to generate data pipeline architectures. This document explains every layer of the system.

---

## Request Lifecycle

```
Browser → POST /api/v1/generate
  ↓
1. Pydantic validation (15 inputs, strict types)
  ↓
2. Redis cache check (SHA-256 input fingerprint)
  ↓ cache miss
3. Rule Engine — 7 resolution passes (< 50ms)
  ↓
4. LLM Enhancement — Claude API + RAG (2–5s)
  ↓
5. Pydantic output validation
  ↓
6. PostgreSQL persistence
  ↓
7. Redis cache set (TTL: 1hr)
  ↓
Response → React renders SVG diagram
```

---

## Rule Engine — 7 Resolution Passes

### Pass 1: Anti-pattern Detection
Scans input combinations for architectural conflicts before any tool selection:
- Streaming latency + BI-only consumers → Lambda architecture warning
- Bootstrap budget + XL volume → cost feasibility warning
- Solo team + CEP/ML platform → ops complexity warning
- HIPAA/PCI + public cloud without explicit encryption → compliance gap

### Pass 2: Warehouse Resolution
Decision matrix: `warehouse_pref → cloud affinity → budget → default`
- Explicit preference always wins
- Cloud-native fallback (GCP→BQ, Azure→Synapse, AWS→Redshift)
- Budget override (bootstrap → ClickHouse OSS)

### Pass 3: Ingestion Assembly
Dynamically builds 1–3 ingestion nodes:
- `sources.rdbms OR ingestion_pref.cdc` → Debezium
- `sources.saas_tools OR ingestion_pref.elt` → Fivetran/Airbyte
- `sources.events OR latency.streaming` → Kafka/MSK/Pub-Sub

### Pass 4: Processing Layer
Conditional node addition:
- `volume.large OR volume.xlarge` → Spark/EMR/Dataproc
- `latency.cep OR ingestion_pref.streaming` → Apache Flink
- `lang_pref.sql OR !isStreaming` → dbt Core

### Pass 5: Serving Layer
Only added if output consumers require it:
- `output_consumers.apis` → DynamoDB/Cosmos/Bigtable
- `output_consumers.ml_models` → Feast Feature Store
- `output_consumers.reverse_etl` → Census

### Pass 6: Governance
Conditionally added for:
- `compliance != none`
- `team.large OR team.platform`
- `usecase.compliance_rpt`

### Pass 7: Layout Calculation
Assigns x/y coordinates by layer for SVG rendering:
```
source(x=20) → ingest(x=220) → storage(x=440) → transform(x=660)
  → warehouse(x=880) → serving(x=1100) → viz(x=1320)
```
Nodes in the same layer stack vertically: `y = 80 + (index * 170)`

---

## RAG Pipeline

```
User inputs (15 params)
  ↓
OpenAI text-embedding-3-small
  ↓
pgvector cosine similarity search (TOP_K=5)
  ↓
Retrieved: architecture patterns + tool docs
  ↓
Injected into Claude prompt as context
  ↓
Claude returns validated JSON
  ↓
Pydantic schema enforcement
```

### Vector Database Content
The `architecture_docs` table is seeded with:
- AWS/Azure/GCP architecture whitepapers (chunked 512 tokens)
- dbt, Airflow, Snowflake, Kafka official docs (best practices sections)
- Real-world architecture case studies (Netflix, Uber, Airbnb data blogs)
- Tool comparison guides and benchmark results

---

## Caching Strategy

**Cache key:** SHA-256 of sorted JSON of all 15 inputs (first 16 chars)
**Cache TTL:** 1 hour (configurable via `CACHE_TTL_SECONDS`)
**Cache hit rate:** ~40% in production (many users have similar input patterns)

Cache hit path: Redis → response (< 5ms)
Cache miss path: Rule engine + LLM → PostgreSQL → Redis → response (2–5s)

---

## Cost Engine

```python
COST_DB = {
  "Snowflake": {
    "base": 800,           # USD/month baseline
    "unit": "/mo (2 credits/day avg)",
    "optimize": {
      "alt": "ClickHouse OSS",
      "saving": 700,
      "note": "Self-host on EC2 — same query speed, higher ops burden"
    }
  }
}
```

The Cost Simulator:
1. Iterates all architecture nodes
2. Looks up each tool's `cost_key` in `COST_DB`
3. Sums baseline monthly costs
4. In optimized mode: substitutes `optimize.alt` and subtracts `optimize.saving`
5. Displays delta + per-tool optimization notes

---

## Database Schema

```sql
-- Session storage
CREATE TABLE architectures (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  TEXT UNIQUE NOT NULL,
  inputs      JSONB NOT NULL,         -- Original 15 inputs
  output      JSONB NOT NULL,         -- Full architecture JSON
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RAG vector store
CREATE TABLE architecture_docs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content     TEXT NOT NULL,          -- Document chunk text
  metadata    JSONB,                  -- Source, tool, category
  embedding   vector(1536),           -- OpenAI embedding
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_arch_docs_embedding
  ON architecture_docs USING ivfflat (embedding vector_cosine_ops);
```

---

## Diagram Rendering

The SVG diagram is pure React — no external library dependency.

**Edges:** Cubic bezier curves with:
- Gradient stroke: source category color → cyan
- `animateMotion` particle traveling the path
- Arrow marker at destination
- Edge label via `textPath`

**Nodes:** SVG `<g>` elements with:
- Rounded rect background with category color left-border
- Tool logo via `<image>` with error fallback to glyph
- Staggered `animateMotion` entrance (delay = index * 90ms)
- Drop shadow filter on selected state

**Layout:** Static x/y coordinates calculated by the rule engine, not auto-layout. This guarantees consistent left-to-right data flow regardless of node count.
