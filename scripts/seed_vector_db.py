"""
ArchIQ — Seed Vector Database
Populates pgvector with architecture patterns and tool documentation
for the RAG pipeline.

Usage: python scripts/seed_vector_db.py
"""

import asyncio
import asyncpg
import openai
import json
from pathlib import Path

DATABASE_URL = "postgresql://archiq:password@localhost:5432/archiq"
OPENAI_API_KEY = ""  # Set via env var OPENAI_API_KEY

# Architecture patterns and tool docs to embed
DOCUMENTS = [
    {
        "content": "AWS Modern Analytics Stack: S3 data lake → Fivetran ingestion → dbt transformations → Redshift warehouse → Tableau dashboards. Best for AWS-committed teams with batch workloads under 10TB/day. Cost: $1,200-2,500/month.",
        "metadata": {"type": "pattern", "cloud": "aws", "usecase": "analytics"}
    },
    {
        "content": "GCP Streaming Architecture: Pub/Sub → Dataflow (Apache Beam) → BigQuery → Looker. Serverless components eliminate cluster management. Best for GCP orgs with real-time requirements. Pub/Sub auto-scales to millions of messages/sec.",
        "metadata": {"type": "pattern", "cloud": "gcp", "usecase": "realtime"}
    },
    {
        "content": "Azure Lakehouse Pattern: ADLS Gen2 → Azure Data Factory → Databricks (Delta Lake) → Azure Synapse → Power BI. Native Azure AD integration for enterprise security. Best for Microsoft-committed orgs.",
        "metadata": {"type": "pattern", "cloud": "azure", "usecase": "lakehouse"}
    },
    {
        "content": "Snowflake Best Practices: Use multi-cluster warehouses for high concurrency. Enable auto-suspend (5 min) to save credits. Use resource monitors to cap spending. Zero-copy cloning for dev/test environments saves storage costs.",
        "metadata": {"type": "tool_doc", "tool": "Snowflake"}
    },
    {
        "content": "dbt Best Practices: Use incremental models for large tables. Apply source freshness checks. Layer models as staging → intermediate → marts. Use dbt tests (not-null, unique, relationships) on every model. Store sensitive configs in profiles.yml not dbt_project.yml.",
        "metadata": {"type": "tool_doc", "tool": "dbt"}
    },
    {
        "content": "Apache Kafka Production Setup: Use 3+ brokers for HA. Replication factor of 3 for critical topics. Enable idempotent producers for exactly-once. Use Schema Registry to prevent breaking schema changes. Monitor consumer lag as primary health metric.",
        "metadata": {"type": "tool_doc", "tool": "Kafka"}
    },
    {
        "content": "Apache Airflow Best Practices: Use KubernetesExecutor or CeleryExecutor in production, never SequentialExecutor. Keep DAGs stateless. Use XComs sparingly. Enable DAG serialization. Set catchup=False on new DAGs. Use SLAs and callbacks for alerting.",
        "metadata": {"type": "tool_doc", "tool": "Airflow"}
    },
    {
        "content": "ML Platform Architecture: Feature store (Feast/Tecton) → Training pipeline (Spark/dbt) → Model registry (MLflow) → Serving (FastAPI + Redis) → Monitoring (Evidently). Prevents training-serving skew. Point-in-time correct features critical for financial ML.",
        "metadata": {"type": "pattern", "usecase": "ml_platform"}
    },
    {
        "content": "HIPAA Compliant Data Pipeline: All PHI must be encrypted at rest (AES-256) and in transit (TLS 1.2+). Implement column-level encryption for PII fields. Maintain audit logs for all data access. Use VPC endpoints — no public internet exposure. BAA required with all cloud providers.",
        "metadata": {"type": "compliance", "regulation": "hipaa"}
    },
    {
        "content": "Cost Optimization Patterns: Use Spot/Preemptible instances for batch ETL jobs (60-80% savings). Compress data with Parquet/ORC before storage. Partition tables by date to reduce scan costs. Use data lifecycle policies to tier cold data to cheaper storage classes.",
        "metadata": {"type": "optimization", "category": "cost"}
    },
]


async def seed():
    client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
    conn = await asyncpg.connect(DATABASE_URL)

    print(f"Seeding {len(DOCUMENTS)} documents...")

    for i, doc in enumerate(DOCUMENTS):
        # Generate embedding
        response = await client.embeddings.create(
            model="text-embedding-3-small",
            input=doc["content"]
        )
        embedding = response.data[0].embedding

        # Insert into pgvector table
        await conn.execute(
            """
            INSERT INTO architecture_docs (content, metadata, embedding)
            VALUES ($1, $2, $3::vector)
            ON CONFLICT DO NOTHING
            """,
            doc["content"],
            json.dumps(doc["metadata"]),
            embedding,
        )
        print(f"  ✅ Seeded doc {i+1}/{len(DOCUMENTS)}: {doc['metadata'].get('type')} - {doc['metadata'].get('tool', doc['metadata'].get('cloud', ''))}")

    await conn.close()
    print("\n✅ Vector DB seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
