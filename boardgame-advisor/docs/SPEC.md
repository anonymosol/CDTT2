# Product specification

## Product goals

- Recommend games based on players, available time, difficulty, and genre,
  including natural-language requests.
- Help players learn rules, prepare a game setup, and ask questions with
  citations to permitted source material.
- Let an optional account save a game profile and play history to improve
  recommendations.

## Initial scope

- Catalog of 40–60 games with structured metadata.
- Full, permitted rules material for 8–10 games for retrieval and Q&A.
- Filters, chat-based recommendations, and player game statuses/ratings.
- Rules Q&A with citations, a learning summary, setup checklist, and incorrect
  answer feedback.
- Optional accounts and questions about a user's play history.
- Administration for game metadata, permitted rule documents, and feedback.

## Out of scope for the initial release

- Collaborative filtering requiring a large user base.
- Multi-account group recommendations.
- Detailed play-by-play logs, image-based table recognition, and scorekeeping.

## Privacy and content

- Guest use should remain possible.
- Account deletion and data export must be supported by the API.
- Use only original, public-domain, or appropriately licensed rules material.
  Document sources and licenses in `../data/LICENSES.md`.
- Do not reproduce commercial rulebooks without permission.

## Technical assumptions

- React + Vite + Tailwind CSS (PWA), Node.js + TypeScript + Express, and
  PostgreSQL + pgvector.
- LLM providers are called only from the backend.
- Confirm API contract and scope with the full team before implementation.

## Initial data model candidates

`users`, `games`, `mechanics`, `game_mechanics`, `rule_chunks`, `user_games`,
`play_sessions`, `taste_profiles`, `consents`, `chat_sessions`, `messages`,
`feedback`, and `eval_questions`.
