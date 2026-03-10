"""
ArchIQ — Input Validation Models
All 15 wizard parameters with strict type validation.
"""

from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum


class Industry(str, Enum):
    fintech = "fintech"
    ecommerce = "ecommerce"
    healthcare = "healthcare"
    saas = "saas"
    media = "media"
    logistics = "logistics"
    energy = "energy"
    other = "other"


class UseCase(str, Enum):
    analytics = "analytics"
    ml_platform = "ml_platform"
    realtime = "realtime"
    lakehouse = "lakehouse"
    cdc = "cdc"
    data_science = "data_science"
    customer360 = "customer360"
    compliance_rpt = "compliance_rpt"


class CloudPlatform(str, Enum):
    aws = "aws"
    azure = "azure"
    gcp = "gcp"
    onprem = "onprem"
    hybrid = "hybrid"
    multicloud = "multicloud"


class DataVolume(str, Enum):
    tiny = "tiny"      # < 1 GB/day
    small = "small"    # 1-100 GB/day
    medium = "medium"  # 100 GB - 10 TB/day
    large = "large"    # 10-100 TB/day
    xlarge = "xlarge"  # > 100 TB/day


class LatencyRequirement(str, Enum):
    batch_daily = "batch_daily"
    batch_hourly = "batch_hourly"
    nearreal = "nearreal"
    streaming = "streaming"
    cep = "cep"


class TeamSize(str, Enum):
    solo = "solo"
    small = "small"
    medium = "medium"
    large = "large"
    platform = "platform"


class LanguagePreference(str, Enum):
    python = "python"
    sql = "sql"
    scala = "scala"
    mixed = "mixed"


class Budget(str, Enum):
    bootstrap = "bootstrap"
    startup = "startup"
    growth = "growth"
    enterprise = "enterprise"


class MigrationType(str, Enum):
    greenfield = "greenfield"
    migrate_hadoop = "migrate_hadoop"
    migrate_legacy = "migrate_legacy"
    extend = "extend"


class WarehousePreference(str, Enum):
    snowflake = "snowflake"
    bigquery = "bigquery"
    redshift = "redshift"
    synapse = "synapse"
    databricks = "databricks"
    clickhouse = "clickhouse"
    no_pref = "no_pref"


class RtoRpo(str, Enum):
    best_effort = "best_effort"
    low = "low"
    medium = "medium"
    high = "high"


# Valid multi-select values
VALID_SOURCES = {
    "rdbms", "nosql", "rest_api", "events", "files",
    "saas_tools", "iot", "logs", "erp", "data_lake",
    "mainframe", "web_scraping"
}
VALID_COMPLIANCE = {
    "none", "gdpr", "hipaa", "pci", "soc2",
    "ccpa", "iso27001", "fedramp"
}
VALID_INGESTION_PREF = {
    "elt", "etl", "cdc", "streaming", "api_pull", "batch_file"
}
VALID_OUTPUT_CONSUMERS = {
    "bi", "ds_notebooks", "ml_models", "apis",
    "reverse_etl", "data_sharing", "alerts", "data_products"
}


class ArchitectureRequest(BaseModel):
    """Full validated input model for architecture generation."""

    industry: Industry
    usecase: UseCase
    sources: List[str]
    cloud: CloudPlatform
    volume: DataVolume
    latency: LatencyRequirement
    team: TeamSize
    lang_pref: LanguagePreference
    budget: Budget
    migration: MigrationType
    compliance: List[str]
    ingestion_pref: List[str]
    warehouse_pref: WarehousePreference
    output_consumers: List[str]
    rto_rpo: RtoRpo

    @field_validator("sources")
    @classmethod
    def validate_sources(cls, v):
        invalid = set(v) - VALID_SOURCES
        if invalid:
            raise ValueError(f"Invalid sources: {invalid}")
        if not v:
            raise ValueError("At least one source is required")
        return v

    @field_validator("compliance")
    @classmethod
    def validate_compliance(cls, v):
        invalid = set(v) - VALID_COMPLIANCE
        if invalid:
            raise ValueError(f"Invalid compliance values: {invalid}")
        return v

    @field_validator("ingestion_pref")
    @classmethod
    def validate_ingestion(cls, v):
        invalid = set(v) - VALID_INGESTION_PREF
        if invalid:
            raise ValueError(f"Invalid ingestion preferences: {invalid}")
        return v

    @field_validator("output_consumers")
    @classmethod
    def validate_consumers(cls, v):
        invalid = set(v) - VALID_OUTPUT_CONSUMERS
        if invalid:
            raise ValueError(f"Invalid output consumers: {invalid}")
        return v

    class Config:
        use_enum_values = True


class RefineRequest(BaseModel):
    """Follow-up refinement request for an existing architecture."""
    session_id: str
    instruction: str
    max_length: int = 500

    @field_validator("instruction")
    @classmethod
    def validate_instruction(cls, v):
        if len(v.strip()) < 10:
            raise ValueError("Instruction must be at least 10 characters")
        return v.strip()
