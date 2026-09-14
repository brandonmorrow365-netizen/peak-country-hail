# Peak Country Website Knowledge Base

This directory is the repository source of truth for the Peak Country website.

## Files

- `CURRENT_DECISIONS.md` — newest binding business, pricing, workflow, trust, privacy, and implementation decisions.
- `APPROVED_COPY.md` — approved public copy and reusable messaging.
- `MASTER_ARCHITECTURE.md` — original detailed website architecture. Where it conflicts with current decisions, current decisions win.
- `IMPLEMENTATION_STATUS.md` — checklist for staged implementation.

## How Codex should use this knowledge

Do not load every document for every task.

For a narrow change:
1. read `CURRENT_DECISIONS.md`;
2. read the relevant approved-copy section if copy is involved;
3. consult `MASTER_ARCHITECTURE.md` only if the task affects architecture or cross-page behavior.

This reduces context usage and prevents old superseded decisions from re-entering production.
