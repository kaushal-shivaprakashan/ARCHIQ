# Contributing to ArchIQ

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/yourusername/archiq.git
cd archiq
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
make install
make dev
```

## Areas to Contribute

### High Impact
- **New architecture templates** — Add tool combinations for new cloud/use-case combos in `backend/app/services/architecture_engine.py`
- **Cost database updates** — Keep tool pricing current in `frontend/src/utils/costDatabase.js`
- **Tool logos** — Add missing logo URLs in `frontend/src/utils/toolLogos.js`
- **Anti-pattern library** — Add new conflict patterns in the engine and system prompt

### Medium Impact
- **RAG document seeding** — Add more architecture docs to `scripts/seed_vector_db.py`
- **Test coverage** — Extend `backend/tests/` with edge case scenarios
- **Few-shot examples** — Add better examples to `backend/app/prompts/few_shot_examples.json`

### Feature Requests
- Terraform/IaC export
- Architecture comparison mode
- Shareable architecture URLs
- PDF export

## Pull Request Guidelines

1. Branch naming: `feat/terraform-export`, `fix/bigquery-cost`, `docs/api-reference`
2. Write tests for new engine logic
3. Update `COST_DB` if adding new tools
4. Keep PR scope focused — one feature per PR

## Code Style

- **Python:** `black` formatter, `ruff` linter
- **JavaScript:** `prettier` formatter, `eslint` linter
- Run `make format` before committing

## Questions?

Open an issue with the `question` label.
