"""
ArchIQ — LLM Service
Claude API integration with RAG pipeline.
Enhances rule-engine output with nuanced LLM reasoning.
"""

import anthropic
import json
from pathlib import Path
from app.core.config import settings
from app.models.inputs import ArchitectureRequest
from app.models.outputs import ArchitectureResponse

SYSTEM_PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "system_prompt.txt"
FEW_SHOT_PATH = Path(__file__).parent.parent / "prompts" / "few_shot_examples.json"


class LLMService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.system_prompt = SYSTEM_PROMPT_PATH.read_text()
        self.few_shots = json.loads(FEW_SHOT_PATH.read_text())

    def _build_prompt(
        self,
        inputs: dict,
        rule_arch: ArchitectureResponse,
        rag_context: str = "",
        instruction: str = "",
    ) -> str:
        """Assemble the full prompt with context, inputs, and few-shots."""
        parts = []

        if rag_context:
            parts.append(f"## Relevant Architecture Patterns\n{rag_context}\n")

        parts.append(f"""
## User Requirements
{json.dumps(inputs, indent=2)}

## Rule Engine Baseline Architecture
The rule engine has generated this initial architecture. Your job is to:
1. Validate the tool selections against the requirements
2. Add more specific reasoning bullets (4 per tool, max 20 words each)
3. Identify any additional anti-patterns the rule engine missed
4. Suggest one optimization per layer where applicable

Current architecture nodes: {json.dumps([n.model_dump() for n in rule_arch.nodes], indent=2)}
""")

        if instruction:
            parts.append(f"\n## Refinement Instruction\n{instruction}\n")

        parts.append("""
## Output Format
Respond ONLY with valid JSON matching this exact schema. No preamble, no markdown fences:
{
  "nodes": [
    {
      "id": "string",
      "label": "string",
      "sublabel": "string",
      "category": "string",
      "x": number,
      "y": number,
      "why": ["bullet 1 max 20 words", "bullet 2", "bullet 3", "bullet 4"],
      "tradeoffs": ["tradeoff 1", "tradeoff 2", "tradeoff 3"],
      "cost_key": "string or null",
      "alts": ["alt1", "alt2"]
    }
  ],
  "edges": [{"from": "id", "to": "id", "label": "string"}],
  "warnings": [{"type": "conflict|cost|ops|migration", "msg": "string"}],
  "summary": "2 sentence architecture summary",
  "tags": ["tag1", "tag2"]
}
""")

        return "\n".join(parts)

    async def enhance(
        self, inputs: ArchitectureRequest, rule_arch: ArchitectureResponse
    ) -> ArchitectureResponse:
        """
        Enhance a rule-engine architecture with LLM reasoning.
        Uses Claude to validate, deepen reasoning, and catch edge cases.
        """
        prompt = self._build_prompt(inputs.model_dump(), rule_arch)

        # Add few-shot examples as conversation turns
        messages = []
        for example in self.few_shots[:2]:  # Use first 2 examples
            messages.append({"role": "user", "content": example["input"]})
            messages.append({"role": "assistant", "content": json.dumps(example["output"])})

        messages.append({"role": "user", "content": prompt})

        response = self.client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=settings.LLM_MAX_TOKENS,
            temperature=settings.LLM_TEMPERATURE,
            system=self.system_prompt,
            messages=messages,
        )

        raw = response.content[0].text.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        llm_output = json.loads(raw)

        # Merge LLM output back into rule_arch
        # LLM updates why/tradeoffs/warnings; rule engine keeps x/y/layout
        node_map = {n.id: n for n in rule_arch.nodes}
        for llm_node in llm_output.get("nodes", []):
            if llm_node["id"] in node_map:
                node = node_map[llm_node["id"]]
                node.why = llm_node.get("why", node.why)
                node.tradeoffs = llm_node.get("tradeoffs", node.tradeoffs)

        if llm_output.get("warnings"):
            from app.models.outputs import ArchWarning
            rule_arch.warnings.extend([
                ArchWarning(**w) for w in llm_output["warnings"]
            ])

        if llm_output.get("summary"):
            rule_arch.summary = llm_output["summary"]

        return rule_arch

    async def refine(
        self,
        original_inputs: dict,
        original_arch: ArchitectureResponse,
        instruction: str,
    ) -> ArchitectureResponse:
        """Handle follow-up refinement questions."""
        prompt = self._build_prompt(
            original_inputs, original_arch, instruction=instruction
        )
        messages = [{"role": "user", "content": prompt}]

        response = self.client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=settings.LLM_MAX_TOKENS,
            temperature=settings.LLM_TEMPERATURE,
            system=self.system_prompt,
            messages=messages,
        )

        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        llm_output = json.loads(raw)

        # For refinements, rebuild from LLM output
        from app.models.outputs import ArchNode, ArchEdge, ArchWarning
        original_arch.nodes = [ArchNode(**n) for n in llm_output.get("nodes", [])]
        original_arch.edges = [
            ArchEdge(from_node=e["from"], to_node=e["to"], label=e.get("label",""))
            for e in llm_output.get("edges", [])
        ]
        original_arch.warnings = [ArchWarning(**w) for w in llm_output.get("warnings", [])]
        original_arch.summary = llm_output.get("summary", original_arch.summary)
        original_arch.generated_by = "llm"

        return original_arch
