# Boardgame Advisor

A web app for board-game recommendations and learning game rules, with cited
AI answers.

## Planned stack

- Frontend: React, Vite, Tailwind CSS, and PWA support
- Backend: Node.js, TypeScript, and Express
- Database: PostgreSQL with pgvector
- LLM: called through the backend

## Project layout

- `backend/`: API, database access, recommendation, and rules Q&A
- `frontend/`: user interface and PWA
- `data/`: game metadata and permitted rule sources
- `eval/`: repeatable AI evaluation datasets and results
- `docs/`: product specification, API contract, and project notes

See `AGENTS.md` and `docs/SPEC.md` before starting implementation. The API
contract in `docs/openapi.yaml` should be agreed on by the team before endpoint
work begins. This repository is a scaffold; application code has not yet been
implemented.
