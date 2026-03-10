# ⚡ ArchIQ — AI Data Pipeline Architecture Generator

<div align="center">

**Answer 15 questions. Get a production-ready data architecture in seconds.**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet_4.6-FF6B35?style=flat)](https://anthropic.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)
[![CI](https://github.com/kaushal-shivaprakashan/archiq/actions/workflows/ci.yml/badge.svg)](https://github.com/kaushal-shivaprakashan/archiq/actions)

</div>

---

## 🎯 What is ArchIQ?

ArchIQ is an **AI-powered data pipeline architecture generator** built for data engineers, solutions architects, and CTOs.

You answer **15 structured questions** about your use case, cloud platform, team size, budget, and compliance needs — and ArchIQ returns a **complete interactive architecture diagram** with:

- ✅ Real tool  (Snowflake, dbt, Kafka, Spark, Airflow, Fivetran, and 35+ more)
- ✅ Expert reasoning — *why* each tool was chosen, in 4 bullet points per node
- ✅ Tradeoffs — *what can go wrong*, 3 bullets per node
- ✅ Monthly cost breakdown with optimization suggestions
- ✅ Anti-pattern detection — conflicting requirements flagged before output
- ✅ Compliance-aware — GDPR, HIPAA, PCI-DSS, SOC2, FedRAMP, CCPA, ISO 27001
- ✅ Animated SVG diagram with data-flow particles
- ✅ Works fully offline without an API key (rule engine mode)

---

## 📋 Table of Contents

- [How It Works](#how-it-works)
- [Full Tech Stack](#full-tech-stack)
- [Is It on the Cloud?](#is-it-on-the-cloud)
- [Local Installation](#local-installation)
  - [Option A — Docker (Recommended)](#option-a--docker-recommended)
  - [Option B — Manual Setup](#option-b--manual-setup)
- [Environment Variables](#environment-variables)
- [How to Use the App](#how-to-use-the-app)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deploying to Cloud](#deploying-to-cloud)
- [FAQ](#faq)
- [Author](#author)

---

## How It Works

ArchIQ processes your inputs through **5 stages**:

```
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 1 — INPUT COLLECTION  (React Wizard in Browser)           │
│                                                                   │
│  15-step wizard collects: industry, use case, data sources,      │
│  cloud platform, data volume, latency needs, team size,          │
│  language preference, budget, migration type, compliance,         │
│  ingestion approach, warehouse preference, consumers, RTO/RPO    │
└──────────────────────────┬───────────────────────────────────────┘
                           │  POST /api/v1/generate
┌──────────────────────────▼───────────────────────────────────────┐
│  STAGE 2 — VALIDATION  (FastAPI + Pydantic)                      │
│                                                                   │
│  Strict type checking on all 15 inputs via Pydantic models.      │
│  All fields use enums — no freetext that can break the engine.   │
│  Returns 422 with clear field-level errors if input is invalid.  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│  STAGE 3 — ARCHITECTURE ENGINE  (Python Rule Engine, 7 Passes)   │
│                                                                   │
│  Pass 1: Anti-pattern detection                                   │
│    → Flags conflicting inputs before recommending anything        │
│    → Example: streaming latency + BI-only consumers = warning     │
│                                                                   │
│  Pass 2: Warehouse resolution                                     │
│    → explicit preference → cloud affinity → budget → default     │
│    → GCP → BigQuery | Azure → Synapse | bootstrap → ClickHouse   │
│                                                                   │
│  Pass 3: Ingestion layer assembly                                 │
│    → rdbms sources → Debezium CDC                                 │
│    → saas_tools sources → Fivetran or Airbyte                     │
│    → events/iot → Kafka / MSK / Pub-Sub / Event Hubs             │
│                                                                   │
│  Pass 4: Processing layer                                         │
│    → large/xlarge volume → Spark / EMR / Dataproc                │
│    → cep/streaming latency → Apache Flink                         │
│    → sql preference or batch → dbt Core                          │
│                                                                   │
│  Pass 5: Serving layer (only if output consumers require it)      │
│    → apis → DynamoDB / Cosmos DB / Bigtable                      │
│    → ml_models → Feast Feature Store                             │
│    → reverse_etl → Census                                        │
│                                                                   │
│  Pass 6: Governance (only for compliance/enterprise teams)       │
│    → Azure → Microsoft Purview                                   │
│    → Databricks → Unity Catalog                                  │
│    → default → DataHub / Apache Atlas                            │
│                                                                   │
│  Pass 7: Layout coordinates                                       │
│    → Assigns x/y for SVG left-to-right diagram rendering         │
│    → source → ingest → storage → transform → warehouse           │
│               → serving → visualization                          │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│  STAGE 4 — LLM ENHANCEMENT  (Claude API + RAG)                   │
│                                                                   │
│  1. pgvector similarity search retrieves 5 relevant patterns     │
│  2. Retrieved docs + user inputs + rule engine baseline          │
│     are injected into Claude's context window                    │
│  3. Claude validates tool choices and deepens reasoning bullets  │
│  4. Claude catches edge cases the rule engine cannot handle      │
│  5. Output validated by Pydantic before use                      │
│  6. If Claude API fails → rule engine output used (graceful      │
│     degradation — app never crashes due to LLM unavailability)   │
└──────────────────────────┬───────────────────────────────────────┘
                           │  JSON response
┌──────────────────────────▼───────────────────────────────────────┐
│  STAGE 5 — RENDERING  (React + Pure SVG)                         │
│                                                                   │
│  • Nodes = SVG <g> elements with real tool logos                 │
│  • Edges = cubic bezier curves with animated particles           │
│  • Click node → side panel: why / tradeoffs / cost / alts       │
│  • Cost Simulator modal with optimized stack toggle              │
│  • Anti-pattern warnings displayed as banner alerts              │
└──────────────────────────────────────────────────────────────────┘
```

### Why Are the Recommendations Accurate?

Three layers work together:

| Layer | What it does | Example |
|---|---|---|
| **Domain encoding** | Rule engine encodes real architectural decisions made by senior data architects | `isGCP → BigQuery` — native IAM, Vertex AI integration, zero cluster management |
| **Honest tradeoffs** | Every recommendation includes failure modes — ArchIQ never calls a tool "perfect" | Snowflake gets "Credits model is expensive for always-on workloads" as a tradeoff |
| **Anti-pattern rejection** | Conflicting inputs flagged before recommendations appear | Solo engineer + CEP streaming → ops complexity warning before any tool is shown |

---

## Full Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2+ | UI component framework |
| **Vite** | 5.2+ | Build tool with hot module replacement |
| **Pure SVG** | Native browser | Architecture diagram — no external library |
| **CSS Animations** | Native browser | Data-flow particles, node entrance animations |
| **Fetch API** | Native browser | HTTP calls to FastAPI backend |
| **Google Fonts — Syne** | Web font | Typography for the terminal-noir design system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.11+ | Primary backend language |
| **FastAPI** | 0.110+ | REST API framework — async, Swagger auto-docs |
| **Uvicorn** | 0.27+ | ASGI server running FastAPI |
| **Pydantic v2** | 2.6+ | Strict input/output type validation |
| **pydantic-settings** | 2.2+ | Environment variable loading and validation |
| **asyncpg** | 0.29+ | Async PostgreSQL driver |
| **aioredis** | 2.0+ | Async Redis client |
| **httpx** | 0.27+ | Async HTTP client |

### AI and LLM
| Technology | Version | Purpose |
|---|---|---|
| **Anthropic Claude** | claude-sonnet-4-6 | Architecture reasoning and edge case handling |
| **Anthropic Python SDK** | 0.21+ | Claude API client |
| **Custom Rule Engine** | Python | Deterministic baseline — fully works without any API key |
| **RAG Pipeline** | Custom | Retrieval-augmented generation for grounded output |
| **pgvector** | 0.2+ | PostgreSQL vector extension for similarity search |
| **OpenAI Embeddings** | text-embedding-3-small | Document embedding for the RAG vector store |
| **Few-shot Prompting** | Custom JSON | 2 worked examples injected into every Claude API call |

### Data Engineering — Tools ArchIQ Recommends
> These are the tools ArchIQ selects and explains in its output architectures. They are not used to build ArchIQ itself.

| Category | Tools |
|---|---|
| **Ingestion** | Fivetran, Airbyte, Debezium, Apache Kafka, Amazon MSK, Google Pub/Sub, Azure Event Hubs, Redpanda |
| **Processing** | Apache Spark, Apache Flink, AWS EMR, Google Dataproc, dbt Core, dbt Cloud, AWS Glue |
| **Storage** | Amazon S3, Azure ADLS Gen2, Google Cloud Storage, Delta Lake, Apache Iceberg, MinIO |
| **Warehousing** | Snowflake, BigQuery, Amazon Redshift, Azure Synapse, Databricks, ClickHouse |
| **Orchestration** | Apache Airflow, AWS MWAA, Prefect, Dagster, Azure Data Factory, Cloud Composer |
| **Serving** | Amazon DynamoDB, Azure Cosmos DB, Redis, Feast, Census, Hightouch |
| **Governance** | Apache Atlas, DataHub, Microsoft Purview, Unity Catalog, Great Expectations, Monte Carlo |
| **Visualization** | Tableau, Power BI, Looker, Metabase, Amazon QuickSight, Looker Studio |

### Infrastructure and DevOps
| Technology | Purpose |
|---|---|
| **Docker** | Containerization for consistent environments across machines |
| **Docker Compose** | Local multi-service orchestration (postgres + redis + backend + frontend) |
| **PostgreSQL 16 + pgvector** | Session storage, architecture persistence, vector similarity search |
| **Redis 7** | Architecture result caching with 1-hour TTL |
| **GitHub Actions** | CI/CD — automated testing, linting, and deployment |
| **Vercel** | Frontend hosting in production |
| **Railway** | Backend, PostgreSQL, and Redis hosting in production |

---

## Is It on the Cloud?

**No — not by default.** When you clone this repo, everything runs entirely on your local machine:

```
localhost:3000  →  React frontend  (Vite dev server)
localhost:8000  →  FastAPI backend  (Uvicorn)
localhost:5432  →  PostgreSQL database  (Docker container)
localhost:6379  →  Redis cache  (Docker container)
```

Nothing sends data to any external cloud service except the Anthropic API — and even that is optional. Your architecture inputs and generated diagrams stay on your machine.

To deploy to cloud, see [Deploying to Cloud](#deploying-to-cloud).

---

## Local Installation

### Prerequisites

| Tool | Min Version | Check | Download |
|---|---|---|---|
| Git | Any | `git --version` | [git-scm.com](https://git-scm.com) |
| Docker Desktop | 4.0+ | `docker --version` | [docker.com](https://www.docker.com/get-started/) |
| Docker Compose | 2.0+ | `docker compose version` | Included with Docker Desktop |
| Node.js | 18+ | `node --version` | [nodejs.org](https://nodejs.org) — manual setup only |
| Python | 3.11+ | `python3 --version` | [python.org](https://python.org) — manual setup only |

> **Anthropic API key is optional.** The app runs fully without it using the rule engine. All tool recommendations, cost estimates, and anti-pattern warnings still work. Get a key at [console.anthropic.com](https://console.anthropic.com) if you want Claude to enhance the reasoning.

---

### Option A — Docker (Recommended)

The easiest way. One command starts everything.

```bash
# 1. Clone the repository
git clone https://github.com/kaushal-shivaprakashan/archiq.git
cd archiq

# 2. Create your environment file
cp .env.example .env

# 3. Optional: open .env and add your Anthropic API key
#    ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
#    Skip this step to use rule-engine-only mode

# 4. Start everything
docker compose up --build
```

Wait about 60 seconds. When you see `Application startup complete` in the logs:

| What | URL |
|---|---|
| **ArchIQ App** | http://localhost:3000 |
| **API Docs (Swagger)** | http://localhost:8000/docs |
| **API Docs (ReDoc)** | http://localhost:8000/redoc |
| **Health check** | http://localhost:8000/health |

**Useful Docker commands:**

```bash
# Stop all services — keeps your data
docker compose down

# Stop and wipe all data — fresh start
docker compose down -v

# View all logs live
docker compose logs -f

# View one service only
docker compose logs -f backend

# Rebuild after a code change
docker compose up --build
```

---

### Option B — Manual Setup

Use this if you want faster development feedback without rebuilding containers.

```bash
# Step 1 — Clone and start databases only via Docker
git clone https://github.com/kaushal-shivaprakashan/archiq.git
cd archiq
docker compose up postgres redis -d

# Step 2 — Set up Python backend
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Step 3 — Create .env
cd ..
cp .env.example .env
# Edit .env if you have an ANTHROPIC_API_KEY to add

# Step 4 — Start the backend (keep this terminal open)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Step 5 — In a NEW terminal, start the frontend
cd archiq/frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Environment Variables

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Optional | — | Get from console.anthropic.com. App works without it. |
| `DATABASE_URL` | Yes | `postgresql://archiq:password@localhost:5432/archiq` | PostgreSQL connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection string |
| `LLM_MODEL` | No | `claude-sonnet-4-6` | Claude model to use |
| `LLM_MAX_TOKENS` | No | `4096` | Max tokens per LLM response |
| `LLM_TEMPERATURE` | No | `0.2` | Lower = more deterministic recommendations |
| `ENABLE_CACHE` | No | `true` | Cache results in Redis |
| `ENABLE_RAG` | No | `true` | Enable RAG pipeline (requires API key) |
| `CACHE_TTL_SECONDS` | No | `3600` | Cache expiry in seconds |
| `APP_ENV` | No | `development` | `development` or `production` |
| `VITE_API_URL` | No | `http://localhost:8000` | Backend URL used by the React frontend |

---

## How to Use the App

### Full Step-by-Step Walkthrough

**1.** Open **http://localhost:3000** and click **"Build My Architecture →"**

**2.** Complete the **15-step wizard:**

| Step | Question | Example | What It Controls |
|---|---|---|---|
| 1 | Industry | FinTech | Compliance defaults, fraud tooling awareness |
| 2 | Use Case | Business Analytics | Anchors the entire architecture pattern |
| 3 | Data Sources | Relational DBs + SaaS Tools | Which ingestion tools are added |
| 4 | Cloud Platform | Amazon AWS | Filters out non-native tools |
| 5 | Data Volume | 100 GB–10 TB/day | Whether managed services are viable |
| 6 | Latency | Hourly Batch | Whether Kafka/Flink are added |
| 7 | Team Size | Small Team (3–8) | Ops complexity ceiling — managed vs self-hosted |
| 8 | Language | Python | SDK and framework preferences |
| 9 | Monthly Budget | $500–$5K | Open-source vs paid tool threshold |
| 10 | Migration Type | Greenfield | Legacy constraints applied or not |
| 11 | Compliance | SOC 2 Type II | Adds encryption, audit logging, governance layer |
| 12 | Ingestion Approach | ELT | Selects Fivetran / Airbyte over CDC |
| 13 | Warehouse Preference | No Preference | Engine picks best fit for your cloud + budget |
| 14 | Output Consumers | BI Dashboards + ML Models | Adds Feast Feature Store + Tableau nodes |
| 15 | RTO / RPO | Medium Criticality | HA notes, multi-AZ recommendations |

**3.** Wait for generation:
- With API key: 2–5 seconds (rule engine + Claude enhancement)
- Without API key: ~500ms (rule engine only)

**4.** Explore the **architecture diagram:**
- Each node is a tool in your data stack
- Arrows show data flow direction with labels
- Animated particles move along edges showing live data flow

**5.** Click **any node** to open the detail panel:
- 4 bullet points — why this tool was chosen for your specific inputs
- 3 bullet points — tradeoffs and failure modes
- Monthly cost estimate with unit breakdown
- Optimization suggestion — a cheaper alternative with estimated savings
- Alternative tools you could substitute

**6.** Click **"Cost Breakdown"** (top right of diagram) to open the cost simulator:
- Full line-item table, one row per tool
- Monthly baseline total
- Toggle "Show Optimized Stack" to see cheaper alternatives per tool
- Total potential savings shown at the bottom

**7.** Check the **yellow warning banner** (if it appears) — this shows anti-patterns detected from your inputs before any recommendations are made

**8.** Click **"← Redesign"** to restart the wizard and try different inputs

---

## CI/CD Pipeline

ArchIQ uses **GitHub Actions** with three automated workflows:

### CI — runs on every push and every pull request

```
.github/workflows/ci.yml

backend-ci:
  ├── Set up Python 3.11
  ├── pip install requirements.txt + requirements-dev.txt
  ├── ruff check  (linting)
  ├── black --check  (formatting)
  └── pytest tests/ -v  (10 unit tests)

frontend-ci:
  ├── Set up Node 20
  ├── npm ci
  ├── npm run lint
  └── npm run build
```

### Deploy Frontend — runs on merge to main (frontend changes only)

```
.github/workflows/deploy-frontend.yml
  ├── npm run build
  └── Deploy to Vercel production
      Requires secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
```

### Deploy Backend — runs on merge to main (backend changes only)

```
.github/workflows/deploy-backend.yml
  └── Deploy to Railway
      Requires secret: RAILWAY_TOKEN
```

### GitHub Secrets — required for deployment

Go to your repo → **Settings → Secrets and variables → Actions** and add:

| Secret | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | vercel.com → Your project → Settings |
| `VERCEL_PROJECT_ID` | vercel.com → Your project → Settings |
| `RAILWAY_TOKEN` | railway.app → Account Settings |

### Running tests locally

```bash
# All backend tests
cd backend && pytest tests/ -v

# One specific test
cd backend && pytest tests/test_engine.py::test_streaming_adds_kafka -v

# With coverage report
cd backend && pytest tests/ --cov=app --cov-report=term-missing
```

**Current test suite (10 tests):**

| Test | What it verifies |
|---|---|
| `test_basic_aws_analytics` | Basic AWS analytics stack generates valid output |
| `test_streaming_adds_kafka` | Streaming latency adds Kafka/MSK node |
| `test_ml_adds_feature_store` | ML use case adds Feast Feature Store |
| `test_bootstrap_uses_opensource` | Budget constraint selects open-source tools |
| `test_compliance_adds_governance` | HIPAA/SOC2 adds governance layer |
| `test_antipattern_conflict` | Conflicting inputs generate warning messages |
| `test_all_nodes_have_why_bullets` | Every node has reasoning bullets |
| `test_all_nodes_have_coordinates` | SVG layout coordinates are always valid |
| `test_gcp_selects_bigquery` | GCP cloud auto-selects BigQuery |
| `test_azure_selects_synapse` | Azure cloud auto-selects Synapse |

---

## Project Structure

```
archiq/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Test every push + PR
│       ├── deploy-frontend.yml         # Vercel on merge to main
│       └── deploy-backend.yml          # Railway on merge to main
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # Full app: landing, wizard, generating, diagram
│   │   ├── main.jsx                    # Vite entry point
│   │   ├── hooks/
│   │   │   └── useArchitecture.js      # API hook — generate, refine, cost breakdown
│   │   └── styles/
│   │       └── globals.css             # CSS variables, fonts, keyframe animations
│   ├── index.html
│   ├── vite.config.js                  # Vite + API proxy to backend
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI app, CORS, middleware, router
│   │   ├── api/
│   │   │   └── routes.py               # 4 endpoints: generate, get, refine, cost
│   │   ├── core/
│   │   │   ├── config.py               # Pydantic settings from .env
│   │   │   └── database.py             # Connection pools + auto-migration
│   │   ├── models/
│   │   │   ├── inputs.py               # 15-field validated request model
│   │   │   └── outputs.py              # Node, Edge, Warning, Cost response types
│   │   ├── services/
│   │   │   ├── architecture_engine.py  # The 7-pass rule engine (core logic)
│   │   │   ├── llm_service.py          # Claude API + RAG integration
│   │   │   └── cache_service.py        # Redis get/set wrapper
│   │   └── prompts/
│   │       ├── system_prompt.txt       # Claude's expert persona and output rules
│   │       └── few_shot_examples.json  # 2 worked examples for Claude
│   ├── tests/
│   │   └── test_engine.py              # 10 unit tests
│   ├── requirements.txt                # Production Python dependencies
│   ├── requirements-dev.txt            # Dev + test dependencies
│   └── Dockerfile
│
├── docs/
│   ├── ARCHITECTURE.md                 # Deep-dive system design
│   ├── CONTRIBUTING.md                 # How to contribute
│   └── DEPLOYMENT.md                   # Full cloud deployment guide
│
├── scripts/
│   ├── setup_dev.sh                    # One-command dev setup script
│   └── seed_vector_db.py               # Populate pgvector with tool docs
│
├── docker-compose.yml                  # postgres + redis + backend + frontend
├── .env.example                        # All environment variables with descriptions
├── .gitignore
├── Makefile                            # make dev | make test | make deploy-fe
└── README.md
```

---

## API Reference

**Base URL (local):** `http://localhost:8000/api/v1`
**Interactive docs:** `http://localhost:8000/docs`

### POST `/generate`
Generate a full architecture from 15 inputs.

```json
{
  "industry": "fintech",
  "usecase": "analytics",
  "sources": ["rdbms", "rest_api", "saas_tools"],
  "cloud": "aws",
  "volume": "medium",
  "latency": "batch_hourly",
  "team": "small",
  "lang_pref": "python",
  "budget": "startup",
  "migration": "greenfield",
  "compliance": ["soc2"],
  "ingestion_pref": ["elt"],
  "warehouse_pref": "snowflake",
  "output_consumers": ["bi", "ml_models"],
  "rto_rpo": "medium"
}
```

Returns: `session_id`, `title`, `summary`, `nodes`, `edges`, `warnings`, `tags`, `estimated_monthly_cost`, `cost_items`

### GET `/architecture/{session_id}`
Retrieve a previously generated architecture.

### POST `/refine`
Ask a follow-up question about an existing architecture.
```json
{ "session_id": "abc12345", "instruction": "What if we move to GCP in 18 months?" }
```

### GET `/cost/{session_id}`
Get per-tool cost breakdown with optimization suggestions.

---

## Deploying to Cloud

### Frontend → Vercel (free tier available)

```bash
cd frontend
npm run build
npx vercel deploy --prod

# Add in Vercel dashboard:
# Environment variable: VITE_API_URL = https://your-backend.railway.app
```

### Backend → Railway (free tier available)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set APP_ENV=production
railway up
```

Railway provisions PostgreSQL + Redis automatically as add-ons. Full guide in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## FAQ

**Does it work without an Anthropic API key?**
Yes. Rule-engine-only mode gives you all tool recommendations, cost estimates, cost optimization toggles, and anti-pattern warnings. The only difference is Claude does not enhance the reasoning bullets.

**How accurate are the cost estimates?**
They are order-of-magnitude ballpark figures based on typical usage patterns. Useful for comparing stacks, not for forecasting your exact AWS bill. Always verify with each tool's official pricing calculator.

**Can I add new tools to the engine?**
Yes — the architecture engine is designed to be extended. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

**What data does ArchIQ store?**
Your 15 wizard inputs and the generated architecture JSON in PostgreSQL, identified by session ID. No personal information is collected.

**Does it support on-premises architectures?**
Yes. Select "On-Premises" in the cloud platform step. The engine recommends MinIO, HDFS, self-hosted Kafka, and on-prem Airflow.

**Why not use React Flow or a diagram library?**
The SVG diagram is intentionally built from scratch with pure React and SVG. This eliminates a large dependency, gives full control over the animated particles and styling, and makes the bundle significantly smaller.

---

## Author

Built by **Kaushal Shivaprakash** — Data Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kaushal_Shivaprakash-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kaushal-shivaprakash/)
[![GitHub](https://img.shields.io/badge/GitHub-kaushal--shivaprakashan-181717?style=flat&logo=github&logoColor=white)](https://github.com/kaushal-shivaprakashan)

---

<div align="center">
<strong>⭐ Star this repo if ArchIQ helped you design a better data pipeline</strong>
</div>
