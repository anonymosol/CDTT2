# Instructions for coding agents

- Read `README.md`, `docs/SPEC.md`, and `docs/openapi.yaml` before making changes.
- Keep API behavior consistent with `docs/openapi.yaml`; update the contract
  with the team when behavior changes.
- Keep secrets out of source control. Use environment variables and update
  `.env.example` when configuration changes.
- Use only game-rule sources that the project is permitted to use. Record
  source and license details in `data/LICENSES.md`; do not copy protected
  rulebooks into the repository without permission.
- Add or update focused tests for behavior changes.
- Keep AI answers grounded in retrieved sources, include citations, and
  explicitly indicate when evidence is insufficient.
- Do not store or send personal data beyond the consent and privacy behavior
  defined by the product specification.
