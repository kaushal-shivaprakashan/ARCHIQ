"""
ArchIQ — Architecture Engine Tests
"""

import pytest
from app.models.inputs import ArchitectureRequest
from app.services.architecture_engine import ArchitectureEngine

engine = ArchitectureEngine()


def make_request(**overrides) -> ArchitectureRequest:
    defaults = {
        "industry": "saas",
        "usecase": "analytics",
        "sources": ["rdbms", "rest_api"],
        "cloud": "aws",
        "volume": "medium",
        "latency": "batch_hourly",
        "team": "small",
        "lang_pref": "python",
        "budget": "startup",
        "migration": "greenfield",
        "compliance": ["none"],
        "ingestion_pref": ["elt"],
        "warehouse_pref": "no_pref",
        "output_consumers": ["bi"],
        "rto_rpo": "low",
    }
    defaults.update(overrides)
    return ArchitectureRequest(**defaults)


def test_basic_aws_analytics():
    req = make_request()
    arch = engine.build(req)
    assert arch.title
    assert len(arch.nodes) > 0
    assert len(arch.edges) > 0
    node_ids = [n.id for n in arch.nodes]
    assert "warehouse" in node_ids


def test_streaming_adds_kafka():
    req = make_request(latency="streaming", sources=["events", "rdbms"])
    arch = engine.build(req)
    labels = [n.label for n in arch.nodes]
    assert any("kafka" in l.lower() or "msk" in l.lower() or "kinesis" in l.lower() for l in labels)


def test_ml_adds_feature_store():
    req = make_request(usecase="ml_platform", output_consumers=["ml_models", "bi"])
    arch = engine.build(req)
    categories = [n.category for n in arch.nodes]
    assert "serving" in categories


def test_bootstrap_uses_opensource():
    req = make_request(budget="bootstrap")
    arch = engine.build(req)
    labels = [n.label for n in arch.nodes]
    assert any("Airbyte" in l or "Metabase" in l or "Great Expectations" in l for l in labels)


def test_compliance_adds_governance():
    req = make_request(compliance=["hipaa", "soc2"], team="large")
    arch = engine.build(req)
    categories = [n.category for n in arch.nodes]
    assert "governance" in categories


def test_antipattern_streaming_analytics_conflict():
    req = make_request(latency="cep", usecase="analytics")
    arch = engine.build(req)
    assert len(arch.warnings) > 0
    warning_msgs = [w.msg for w in arch.warnings]
    assert any("conflict" in w.lower() or "real-time" in w.lower() for w in warning_msgs)


def test_all_nodes_have_why_bullets():
    req = make_request()
    arch = engine.build(req)
    for node in arch.nodes:
        assert len(node.why) > 0, f"Node {node.id} has no why bullets"


def test_all_nodes_have_coordinates():
    req = make_request()
    arch = engine.build(req)
    for node in arch.nodes:
        assert node.x >= 0 and node.y >= 0, f"Node {node.id} has invalid coordinates"


def test_gcp_selects_bigquery():
    req = make_request(cloud="gcp", warehouse_pref="no_pref")
    arch = engine.build(req)
    wh = next((n for n in arch.nodes if n.id == "warehouse"), None)
    assert wh and "bigquery" in wh.label.lower()


def test_azure_selects_synapse():
    req = make_request(cloud="azure", warehouse_pref="no_pref")
    arch = engine.build(req)
    wh = next((n for n in arch.nodes if n.id == "warehouse"), None)
    assert wh and ("synapse" in wh.label.lower() or "azure" in wh.label.lower())
