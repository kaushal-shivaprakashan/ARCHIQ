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
[![CI](https://github.com/yourusername/archiq/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/archiq/actions)

</div>

---

## What is ArchIQ?

ArchIQ is an AI-powered data pipeline architecture generator for data engineers, solutions architects, and CTOs. You answer 15 structured questions about your use case, cloud platform, team size, budget, and compliance needs — and get back a full interactive architecture diagram with expert reasoning, monthly cost estimates, and optimization suggestions.

**Who it is for:**
- Data Engineers deciding which tools to use for a new pipeline
- Solutions Architects designing cloud data infrastructure  
- CTOs evaluating the modern data stack for their organization
- Students and bootcamp graduates learning real-world data architectures

---

## Table of Contents

- [How It Works](#how-it-works)
- [Full Tech Stack](#full-tech-stack)
- [Is It Running on Cloud?](#is-it-running-on-cloud)
- [Local Installation](#local-installation)
- [Environment Variables](#environment-variables)
- [How to Use the App](#how-to-use-the-app)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Deploying to Cloud](#deploying-to-cloud)
- [FAQ](#faq)

---

## How It Works

ArchIQ processes your inputs through 5 stages:

### Stage 1 — Input Collection (Browser)
The 15-step wizard collects structured inputs across 5 categories:

| Category | Parameters |
|---|---|
| Business Context | Industry vertical, Primary use case, Migration type |
| Technical Profile | Data sources, Data volume, Latency requirements, Language preference |
| Infrastructure | Cloud platform, Warehouse preference, RTO/RPO requirements |
| Team and Budget | Team size and maturity, Monthly infrastructure budget |
| Compliance | Regulatory requirements, Ingestion approach, Output consumers |

### Stage 2 — Validation (FastAPI + Pydantic)
Every input is validated with strict Pydantic models before processing. Invalid combinations return a 422 error with clear field-level messages. All 15 parameters use enums — no freetext that can break the engine.

### Stage 3 — Architecture Engine (Python Rule Engine)
The core of ArchIQ is a 7-pass deterministic rule engine written in Python:

```
Pass 1: Anti-pattern detection
        Scans for conflicting requirements before recommending anything.
        Example: streaming latency + batch-only BI tools = Lambda architecture warning

Pass 2: Warehouse resolution
        Decision matrix: explicit preference → cloud affinity → budget → default
        GCP always → BigQuery | Azure always → Synapse | bootstrap → ClickHouse OSS

Pass 3: Ingestion layer assembly
        Dynamically builds 1-3 ingestion nodes based on source types:
        rdbms sources → Debezium CDC
        saas_tools sources → Fivetran or Airbyte
        events/iot sources → Kafka / MSK / Pub-Sub / Event Hubs

Pass 4: Processing layer
        large/xlarge volume → Spark / EMR / Dataproc
        cep/streaming latency → Apache Flink
        sql preference or batch → dbt Core

Pass 5: Serving layer (conditional — only added if needed)
        output_consumers.apis → DynamoDB / Cosmos DB / Bigtable
        output_consumers.ml_models → Feast Feature Store
        output_consumers.reverse_etl → Census

Pass 6: Governance (conditional — only for compliance/enterprise)
        compliance != none OR team.large OR team.platform
        Azure → Microsoft Purview | Databricks → Unity Catalog | else → DataHub

Pass 7: Layout coordinates
        Assigns x/y positions by layer for the SVG diagram.
        source(x=20) → ingest(x=220) → storage(x=440) → transform(x=660)
        → warehouse(x=880) → serving(x=1100) → viz(x=1320)
```

### Stage 4 — LLM Enhancement (Claude API + RAG)
After the rule engine generates a baseline, Claude deepens the reasoning:

```
1. pgvector similarity search finds the 5 most relevant architecture patterns
2. Retrieved docs + user inputs + rule engine baseline injected into Claude's context
3. Claude validates tool choices and writes deeper reasoning bullets
4. Claude catches edge cases the rule engine cannot handle
5. Structured JSON response is validated by Pydantic before use
6. If Claude API fails for any reason, rule engine output is used as-is (graceful degradation)
```

### Stage 5 — Rendering (React + Pure SVG)
The architecture JSON is rendered entirely in React using native SVG — no external diagram library. Edges are cubic bezier curves with animated data-flow particles. Nodes appear with staggered entrance animations. Clicking a node opens a detail panel with reasoning bullets.

### Why Are Recommendations Accurate?

Three layers of correctness work together:

**Domain encoding** — The rule engine encodes real architectural decisions. The mapping `isGCP → BigQuery` exists because BigQuery has native GCP IAM, Vertex AI integration, and zero cluster management. These are not random choices.

**Honest tradeoffs** — Every recommendation includes what is wrong with it. ArchIQ never says a tool is perfect. Snowflake gets "Credits model is expensive for always-on workloads" as a tradeoff bullet.

**Anti-pattern rejection** — Conflicting inputs are flagged before any tool is recommended. A solo engineer selecting CEP streaming gets a warning that the operational complexity is dangerous for their team size, before seeing any tool suggestions.

---

## Full Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2+ | UI component framework |
| Vite | 5.2+ | Build tool with hot module replacement |
| Pure SVG | Native browser | Architecture diagram rendering — no library needed |
| CSS Animations | Native browser | Data flow particles, node entrance animations |
| Fetch API | Native browser | HTTP calls to FastAPI backend |
| Google Fonts (Syne) | Web font | Typography — distinctive technical aesthetic |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Primary backend language |
| FastAPI | 0.110+ | REST API framework — async, Swagger auto-docs |
| Uvicorn | 0.27+ | ASGI server running FastAPI |
| Pydantic v2 | 2.6+ | Input/output validation with strict type enforcement |
| pydantic-settings | 2.2+ | Environment variable loading and validation |
| asyncpg | 0.29+ | Async PostgreSQL driver |
| aioredis | 2.0+ | Async Redis client |
| httpx | 0.27+ | Async HTTP client |

### AI and LLM
| Technology | Version | Purpose |
|---|---|---|
| Anthropic Claude | claude-sonnet-4-6 | Architecture reasoning and edge case handling |
| Anthropic Python SDK | 0.21+ | Claude API client |
| Rule Engine | Custom Python | Deterministic baseline — fully works without any API key |
| RAG Pipeline | Custom | Retrieval-augmented generation for grounded output |
| pgvector | 0.2+ | PostgreSQL vector extension for similarity search |
| OpenAI Embeddings | text-embedding-3-small | Document embedding for the RAG vector store |
| Few-shot Prompting | Custom JSON | 2 worked examples injected into every Claude API call |

### Infrastructure and DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerization for consistent environments |
| Docker Compose | Local multi-service orchestration |
| PostgreSQL 16+ | Session storage and architecture persistence |
| pgvector extension | Vector similarity search for RAG |
| Redis 7 | Architecture result caching with 1-hour TTL |
| GitHub Actions | CI/CD — automated testing on every push |
| Vercel | Frontend hosting in production |
| Railway | Backend and database hosting in production |

### Data Engineering Tools (Recommended by ArchIQ, not used to build it)
These are the tools ArchIQ selects and explains in its output architectures:

| Category | Tools |
|---|---|
| Ingestion | Fivetran, Airbyte, Debezium, Apache Kafka, Amazon MSK, Google Pub/Sub, Azure Event Hubs, Redpanda |
| Processing | Apache Spark, Apache Flink, AWS EMR, Google Dataproc, dbt Core, dbt Cloud, AWS Glue |
| Storage | Amazon S3, Azure ADLS Gen2, Google Cloud Storage, Delta Lake, Apache Iceberg, MinIO |
| Warehousing | Snowflake, BigQuery, Amazon Redshift, Azure Synapse, Databricks, ClickHouse |
| Orchestration | Apache Airflow, AWS MWAA, Prefect, Dagster, Azure Data Factory, Cloud Composer |
| Serving | Amazon DynamoDB, Azure Cosmos DB, Redis, Feast, Census, Hightouch |
| Governance | Apache Atlas, DataHub, Microsoft Purview, Unity Catalog, Great Expectations, Monte Carlo |
| Visualization | Tableau, Power BI, Looker, Metabase, Amazon QuickSight, Looker Studio |

---

## Is It Running on Cloud?

**No — not by default.** When you clone this repository, everything runs entirely on your local machine:

```
localhost:3000  →  React frontend (Vite dev server)
localhost:8000  →  FastAPI backend (Uvicorn)
localhost:5432  →  PostgreSQL database (Docker container)
localhost:6379  →  Redis cache (Docker container)
```

Nothing connects to any external cloud service except the Anthropic API (which is optional). Your architecture inputs and outputs stay on your machine.

To deploy to cloud, see the [Deploying to Cloud](#deploying-to-cloud) section.

---

## Local Installation

### Prerequisites

| Tool | Minimum Version | How to Check | Download |
|---|---|---|---|
| Git | Any | `git --version` | [git-scm.com](https://git-scm.com) |
| Docker Desktop | 4.0+ | `docker --version` | [docker.com](https://www.docker.com/get-started/) |
| Docker Compose | 2.0+ | `docker compose version` | Included with Docker Desktop |
| Node.js | 18+ | `node --version` | [nodejs.org](https://nodejs.org) — for manual setup only |
| Python | 3.11+ | `python3 --version` | [python.org](https://python.org) — for manual setup only |

An Anthropic API key is **optional**. The app runs fully without it (rule engine mode). Get one at [console.anthropic.com](https://console.anthropic.com) if you want Claude to enhance the reasoning.

---

### Option A: Docker — Recommended, Easiest

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/archiq.git
cd archiq

# 2. Create your environment file
cp .env.example .env

# 3. Optional: open .env and add your Anthropic API key
#    ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
#    Skip this step to run without LLM (rule engine only)

# 4. Build and start everything
docker compose up --build
```

Wait about 60 seconds. When you see `Application startup complete` in the logs, open:

- **http://localhost:3000** — The ArchIQ application
- **http://localhost:8000/docs** — FastAPI Swagger UI (explore the API)
- **http://localhost:8000/health** — Health check endpoint

**Common Docker commands:**

```bash
# Stop all services (data is kept)
docker compose down

# Stop and wipe all data (fresh start)
docker compose down -v

# View logs from all services
docker compose logs -f

# View logs from one service only
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild after code changes
docker compose up --build
```

---

### Option B: Manual Setup (No Docker for the App)

Use this if you want faster code feedback without rebuilding containers.

You still need Docker for the databases, or install PostgreSQL 16+ and Redis 7+ natively.

```bash
# Step 1: Start databases only
git clone https://github.com/yourusername/archiq.git
cd archiq
docker compose up postgres redis -d

# Step 2: Set up backend
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Step 3: Create .env
cd ..
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY if you have one

# Step 4: Start backend (keep this terminal open)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Step 5: In a NEW terminal — start frontend
cd archiq/frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

### Option C: Automated Script

```bash
git clone https://github.com/yourusername/archiq.git
cd archiq
chmod +x scripts/setup_dev.sh
./scripts/setup_dev.sh
```

The script checks prerequisites, creates your `.env`, installs backend dependencies, and installs frontend dependencies. Then run `make dev` to start.

---

## Environment Variables

Create `.env` from the template:

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
| `LLM_TEMPERATURE` | No | `0.2` | Lower is more deterministic |
| `ENABLE_CACHE` | No | `true` | Cache results in Redis |
| `ENABLE_RAG` | No | `true` | Enable RAG pipeline (requires API key) |
| `CACHE_TTL_SECONDS` | No | `3600` | Cache expiry in seconds |
| `APP_ENV` | No | `development` | `development` or `production` |
| `VITE_API_URL` | No | `http://localhost:8000` | Backend URL used by the frontend |

---

## How to Use the App

### Step-by-step walkthrough

**1. Open the app** at http://localhost:3000 and click "Build My Architecture"

**2. Complete the 15-step wizard.** Each step is explained below:

| Step | Question | Example Answer | Impact on Output |
|---|---|---|---|
| 1 | Industry | FinTech / Banking | Adds PCI-DSS awareness, fraud pattern tooling |
| 2 | Use Case | Business Analytics | Anchors entire architecture toward BI patterns |
| 3 | Data Sources | Relational DBs + SaaS Tools | Adds Debezium CDC + Fivetran ingestion nodes |
| 4 | Cloud Platform | Amazon AWS | Selects S3, Redshift, MSK, Glue as candidates |
| 5 | Data Volume | 100 GB – 10 TB/day | Medium scale — managed services viable |
| 6 | Latency | Hourly Batch | Selects Airflow scheduling, no Flink/Kafka needed |
| 7 | Team Size | Small Team 3–8 | Favors managed over self-hosted tools |
| 8 | Language | Python | PySpark, dbt Python models preferred |
| 9 | Budget | $500 – $5K/month | Selective managed services, open-source where possible |
| 10 | Migration | Greenfield | No legacy constraints — best-fit tools selected |
| 11 | Compliance | SOC 2 Type II | Adds audit logging, encryption requirements |
| 12 | Ingestion | ELT (Load then Transform) | Selects Fivetran as ingestion tool |
| 13 | Warehouse | No Preference | Engine selects Redshift (AWS + medium scale) |
| 14 | Output Consumers | BI + ML Models | Adds Tableau node + Feast Feature Store |
| 15 | RTO/RPO | Medium Criticality | Adds HA notes, recommends multi-AZ |

**3. Wait for generation** (2–5 seconds with API key, ~500ms without)

**4. Explore the architecture diagram:**
- Each node is a tool in the stack
- Arrows show data flow direction with labels
- Animated particles move along each arrow showing live data flow direction

**5. Click any node** to open the detail panel:
- 4 bullet points explaining why that tool was chosen for your inputs
- 3 bullet points on tradeoffs and failure modes
- Monthly cost estimate with unit breakdown
- Optimization suggestion — a cheaper alternative with savings amount
- Alternative tools you could substitute

**6. Click "Cost Breakdown"** (top right) to open the cost simulator:
- Full line-item table — one row per tool
- Monthly baseline total
- Toggle "Show Optimized Stack" to see the cheaper alternative for each tool
- Total savings shown prominently

**7. Check warning banners** (yellow bar under header) — these flag conflicting requirements detected from your inputs before you see any recommendations

**8. Click "← Redesign"** to restart the wizard with different inputs

---

## CI/CD Pipeline

ArchIQ uses GitHub Actions. Three workflows run automatically:

### CI — runs on every push and every pull request

```
.github/workflows/ci.yml

Jobs:
  backend-ci:
    - Checkout code
    - Set up Python 3.11
    - Install requirements.txt + requirements-dev.txt
    - Run ruff (linting)
    - Run black --check (formatting)
    - Run pytest tests/ -v (10 unit tests)

  frontend-ci:
    - Checkout code
    - Set up Node 20
    - Run npm ci
    - Run npm run lint
```

### Deploy Frontend — runs on push to main only

```
.github/workflows/deploy-frontend.yml

Steps:
  - Build React app (npm run build)
  - Deploy to Vercel production
  - Requires: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID secrets
```

### Deploy Backend — runs on push to main only

```
.github/workflows/deploy-backend.yml

Steps:
  - Deploy to Railway
  - Requires: RAILWAY_TOKEN secret
```

### GitHub Secrets required for deployment

Go to your GitHub repo → Settings → Secrets and variables → Actions:

| Secret Name | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | vercel.com → Your project → Settings |
| `VERCEL_PROJECT_ID` | vercel.com → Your project → Settings |
| `RAILWAY_TOKEN` | railway.app → Account Settings |

### Running tests locally

```bash
# All tests
make test

# Backend tests with verbose output
cd backend && pytest tests/ -v

# One specific test
cd backend && pytest tests/test_engine.py::test_streaming_adds_kafka -v

# With test coverage report
cd backend && pytest tests/ --cov=app --cov-report=term-missing
```

---

## API Reference

Base URL (local): `http://localhost:8000/api/v1`

Interactive documentation: `http://localhost:8000/docs`

### POST /generate

Generate a complete architecture from 15 inputs.

Request body:
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

Response: JSON with `session_id`, `title`, `summary`, `nodes`, `edges`, `warnings`, `tags`, `estimated_monthly_cost`, `cost_items`

### GET /architecture/{session_id}

Retrieve a previously generated architecture by session ID.

### POST /refine

Refine an existing architecture with a follow-up instruction.

```json
{
  "session_id": "abc12345",
  "instruction": "What if we move to GCP in 18 months?"
}
```

### GET /cost/{session_id}

Get cost breakdown with per-tool optimization suggestions.

---

## Project Structure

```
archiq/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Test on every push and PR
│       ├── deploy-frontend.yml        # Deploy frontend to Vercel on merge to main
│       └── deploy-backend.yml         # Deploy backend to Railway on merge to main
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Complete application: landing, wizard, diagram
│   │   ├── main.jsx                   # React + Vite entry point
│   │   ├── hooks/
│   │   │   └── useArchitecture.js     # API calls with loading and error states
│   │   └── styles/
│   │       └── globals.css            # CSS variables, fonts, keyframe animations
│   ├── index.html
│   ├── vite.config.js                 # Vite with API proxy to backend
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app factory, CORS, middleware
│   │   ├── api/
│   │   │   └── routes.py              # 4 endpoints: generate, get, refine, cost
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic settings from environment
│   │   │   └── database.py            # Connection pools, auto-migration on startup
│   │   ├── models/
│   │   │   ├── inputs.py              # 15-field validated request model
│   │   │   └── outputs.py             # Node, Edge, Warning, Cost response models
│   │   ├── services/
│   │   │   ├── architecture_engine.py # The 7-pass rule engine
│   │   │   ├── llm_service.py         # Claude API integration with RAG
│   │   │   └── cache_service.py       # Redis wrapper
│   │   └── prompts/
│   │       ├── system_prompt.txt      # Claude's expert persona and output rules
│   │       └── few_shot_examples.json # Training examples for Claude
│   ├── tests/
│   │   └── test_engine.py             # 10 unit tests for the rule engine
│   ├── requirements.txt               # Production Python dependencies
│   ├── requirements-dev.txt           # Development and test dependencies
│   └── Dockerfile
│
├── docs/
│   ├── ARCHITECTURE.md                # Deep-dive system design documentation
│   ├── CONTRIBUTING.md                # How to contribute
│   └── DEPLOYMENT.md                  # Full cloud deployment guide
│
├── scripts/
│   ├── setup_dev.sh                   # One-command dev environment setup
│   └── seed_vector_db.py              # Populate pgvector with architecture docs
│
├── docker-compose.yml                 # postgres + redis + backend + frontend
├── .env.example                       # All environment variables documented
├── .gitignore
├── Makefile                           # make dev, make test, make deploy-fe
└── README.md
```

---

## Deploying to Cloud

### Frontend to Vercel (Free tier available)

```bash
cd frontend
npm run build
npx vercel deploy --prod

# In Vercel dashboard, add environment variable:
# VITE_API_URL = https://your-backend.railway.app
```

### Backend to Railway (Free tier available)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set APP_ENV=production
railway up
```

Railway auto-provisions PostgreSQL with pgvector and Redis as add-ons. Full guide in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## FAQ

**Does it work without an Anthropic API key?**
Yes. Without a key it runs in rule-engine-only mode. All 40+ tool recommendations, cost estimates, cost optimization suggestions, and anti-pattern warnings fully work. The only thing you lose is Claude's enhanced reasoning layer.

**How accurate are the cost estimates?**
They are ballpark figures based on typical usage patterns for each tool. They are useful for order-of-magnitude comparison between stacks, not for precise billing forecasting. Always verify against the official pricing calculator of each tool before committing.

**Can I add new tools to the engine?**
Yes. The architecture engine in `backend/app/services/architecture_engine.py` is designed to be extended. Add new tool nodes with their reasoning bullets and update `COST_DB` with pricing data. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

**What data does ArchIQ store?**
Your 15 wizard inputs and the generated architecture JSON, in PostgreSQL, identified by a session ID. No personal information is collected.

**Does it support on-premises architectures?**
Yes. Select "On-Premises" in the cloud platform step. The engine recommends MinIO, HDFS, self-hosted Kafka, and on-prem Airflow.

---

## License

MIT License — see [LICENSE](LICENSE). Free to use, modify, and distribute.

---

## Author

Built by **[Your Name]** — Data Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/yourusername)

---

<div align="center">
<strong>Star this repo if ArchIQ helped you design a better data pipeline</strong>
</div>
