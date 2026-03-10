"""
ArchIQ — Output Models
Typed output for architecture nodes, edges, and metadata.
"""

from pydantic import BaseModel
from typing import List, Optional


class ArchNode(BaseModel):
    id: str
    label: str
    sublabel: str
    category: str
    x: float
    y: float
    why: List[str]
    tradeoffs: List[str]
    cost_key: Optional[str] = None
    alts: List[str] = []


class ArchEdge(BaseModel):
    from_node: str
    to_node: str
    label: str = ""

    class Config:
        populate_by_name = True
        fields = {"from_node": "from", "to_node": "to"}


class ArchWarning(BaseModel):
    type: str   # "conflict" | "cost" | "ops" | "migration"
    msg: str


class CostItem(BaseModel):
    tool: str
    base_monthly: int
    unit: str
    optimize_alt: Optional[str] = None
    optimize_saving: Optional[int] = None
    optimize_note: Optional[str] = None


class ArchitectureResponse(BaseModel):
    session_id: str
    title: str
    summary: str
    nodes: List[ArchNode]
    edges: List[ArchEdge]
    warnings: List[ArchWarning] = []
    tags: List[str] = []
    estimated_monthly_cost: str
    cost_items: List[CostItem] = []
    generated_by: str = "rule_engine"  # "rule_engine" | "llm" | "hybrid"
